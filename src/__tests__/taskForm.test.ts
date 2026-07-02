import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { TaskForm } from "../components/TaskForm";

const defaultProps = {
  onSubmit: vi.fn(),
};

describe("TaskForm", () => {
  it('affiche le titre "Nouvelle tâche" en mode create par défaut', () => {
    render(React.createElement(TaskForm, defaultProps));
    expect(screen.getByText("Nouvelle tâche")).toBeInTheDocument();
  });

  it("does not submit if title is empty", () => {
    const onSubmit = vi.fn();
    render(React.createElement(TaskForm, defaultProps));
    fireEvent.click(screen.getByText("Ajouter"));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits with title and description", () => {
    const onSubmit = vi.fn();
    render(React.createElement(TaskForm, { ...defaultProps, onSubmit }));

    fireEvent.change(screen.getByLabelText("Titre"), {
      target: { value: "Nouvelle tâche" },
    });
    fireEvent.change(screen.getByPlaceholderText("Description (optionnel)"), {
      target: { value: "Description de la tâche" },
    });

    fireEvent.click(screen.getByText("Ajouter"));
    expect(onSubmit).toHaveBeenCalledWith({
      title: "Nouvelle tâche",
      description: "Description de la tâche",
    });
  });

  it("submits with title only", () => {
    const onSubmit = vi.fn();
    render(React.createElement(TaskForm, { ...defaultProps, onSubmit }));

    fireEvent.change(screen.getByLabelText("Titre"), {
      target: { value: "Nouvelle tâche" },
    });

    fireEvent.click(screen.getByText("Ajouter"));
    expect(onSubmit).toHaveBeenCalledWith({
      title: "Nouvelle tâche",
      description: undefined,
    });
  });

  it("shows the right title in edit mode", () => {
    render(
      React.createElement(TaskForm, {
        ...defaultProps,
        mode: "edit",
        initialValues: {
          title: "Titre existant",
          description: "Description existante",
        },
      }),
    );
    expect(screen.getByText("Modifier la tâche")).toBeInTheDocument();
  });

  it("shows validation error when title is empty in edit mode", () => {
    const onSubmit = vi.fn();
    render(
      React.createElement(TaskForm, {
        ...defaultProps,
        mode: "edit",
        initialValues: {
          title: "Titre existant",
          description: "Description existante",
        },
        onSubmit,
      }),
    );
    fireEvent.change(screen.getByLabelText("Titre"), {
      target: { value: "" },
    });

    fireEvent.click(screen.getByText("Modifier"));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText("Le titre est requis")).toBeInTheDocument();
  });
});

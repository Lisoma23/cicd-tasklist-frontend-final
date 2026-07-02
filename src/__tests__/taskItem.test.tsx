import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { TaskItem } from "../components/TaskItem";
import type { Task } from "../types/task";

const mockTasks: Task[] = [
  {
    id: 1,
    title: "Première tâche",
    description: "Description 1",
    completed: false,
    createdAt: "2026-01-15T10:00:00Z",
    updatedAt: "2026-01-15T10:00:00Z",
  },
  {
    id: 2,
    title: "Deuxième tâche",
    description: null,
    completed: true,
    createdAt: "2026-01-16T10:00:00Z",
    updatedAt: "2026-01-16T10:00:00Z",
  },
];

describe("TaskItem", () => {
  it("cancel editing resets title and description", () => {
    const onToggle = vi.fn();
    const onDelete = vi.fn();
    const onEdit = vi.fn();
    render(
      <TaskItem
        task={mockTasks[0]}
        onToggle={onToggle}
        onDelete={onDelete}
        onEdit={onEdit}
      />,
    );

    // Simulate entering edit mode
    fireEvent.click(screen.getByLabelText("Modifier"));

    // Now the edit inputs are rendered
    const titleInput = screen.getByLabelText("Modifier le titre");
    const descriptionTextarea = screen.getByLabelText(
      "Modifier la description",
    );

    // Change title and description via React-controlled onChange
    fireEvent.change(titleInput, { target: { value: "Titre modifié" } });
    fireEvent.change(descriptionTextarea, {
      target: { value: "Description modifiée" },
    });

    // Cancel
    fireEvent.click(screen.getByText("Annuler"));

    // After cancel, view mode is restored — check displayed text
    expect(screen.getByText(mockTasks[0].title)).toBeInTheDocument();
  });

  it("edit saves changes", () => {
    const onToggle = vi.fn();
    const onDelete = vi.fn();
    const onEdit = vi.fn();
    render(
      <TaskItem
        task={mockTasks[0]}
        onToggle={onToggle}
        onDelete={onDelete}
        onEdit={onEdit}
      />,
    );

    // Simulate entering edit mode
    fireEvent.click(screen.getByLabelText("Modifier"));

    // Now the edit inputs are rendered
    const titleInput = screen.getByLabelText("Modifier le titre");
    const descriptionTextarea = screen.getByLabelText(
      "Modifier la description",
    );

    // Change title and description via React-controlled onChange
    fireEvent.change(titleInput, { target: { value: "Titre modifié" } });
    fireEvent.change(descriptionTextarea, {
      target: { value: "Description modifiée" },
    });

    // Save
    fireEvent.click(screen.getByText("Enregistrer"));

    // onEdit should have been called with the new values
    expect(onEdit).toHaveBeenCalledWith(mockTasks[0].id, {
      title: "Titre modifié",
      description: "Description modifiée",
    });
  });

  it("delete calls onDelete", () => {
    const onToggle = vi.fn();
    const onDelete = vi.fn();
    const onEdit = vi.fn();
    render(
      <TaskItem
        task={mockTasks[0]}
        onToggle={onToggle}
        onDelete={onDelete}
        onEdit={onEdit}
      />,
    );

    const deleteButton = screen.getByLabelText("Supprimer");

    // First click: enters confirmation state
    fireEvent.click(deleteButton);
    // Second click: actually calls onDelete
    fireEvent.click(deleteButton);

    expect(onDelete).toHaveBeenCalledWith(mockTasks[0].id);
  });

  it("toggle calls onToggle", () => {
    const onToggle = vi.fn();
    const onDelete = vi.fn();
    const onEdit = vi.fn();
    render(
      <TaskItem
        task={mockTasks[0]}
        onToggle={onToggle}
        onDelete={onDelete}
        onEdit={onEdit}
      />,
    );

    const checkbox = screen.getByLabelText(
      `Marquer "${mockTasks[0].title}" comme ${mockTasks[0].completed ? "non terminée" : "terminée"}`,
    );
    fireEvent.click(checkbox);

    expect(onToggle).toHaveBeenCalledWith(mockTasks[0].id);
  });
});

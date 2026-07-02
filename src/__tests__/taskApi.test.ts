import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getTask,
} from "../api/taskApi";

const mockTask = {
  id: 1,
  title: "Test",
  description: null,
  completed: false,
  createdAt: "2026-01-15T10:00:00Z",
  updatedAt: "2026-01-15T10:00:00Z",
};

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("taskApi", () => {
  it("getTasks returns array", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([mockTask]),
      }),
    );

    const tasks = await getTasks();
    expect(tasks).toEqual([mockTask]);
    expect(fetch).toHaveBeenCalledWith("/api/tasks");
  });

  it("getTasks id returns task", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockTask),
      }),
    );

    const task = await getTask(mockTask.id);
    expect(task).toEqual(mockTask);
    expect(fetch).toHaveBeenCalledWith(`/api/tasks/${mockTask.id}`);
  });

  it("should create a task", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockTask),
      }),
    );

    const newTask = await createTask({ title: "Test" });

    expect(newTask).toEqual(mockTask);
    expect(fetch).toHaveBeenCalledWith("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Test" }),
    });
  });

  it("should update a task", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockTask),
      }),
    );

    const updatedTask = await updateTask(mockTask.id, { title: "Updated" });

    expect(updatedTask).toEqual(mockTask);
    expect(fetch).toHaveBeenCalledWith(`/api/tasks/${mockTask.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Updated" }),
    });
  });

  it("should delete a task", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(""),
      }),
    );

    await deleteTask(mockTask.id);

    expect(fetch).toHaveBeenCalledWith(`/api/tasks/${mockTask.id}`, {
      method: "DELETE",
    });
  });

  it("should throw an error if fetch fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        text: () => Promise.resolve("Internal Server Error"),
      }),
    );

    await expect(getTasks()).rejects.toThrow("HTTP 500: Internal Server Error");
  });

  it("should throw an error if fetch fails on delete", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        text: () => Promise.resolve("Not Found"),
      }),
    );

    await expect(deleteTask(mockTask.id)).rejects.toThrow(
      "HTTP 404: Not Found",
    );
  });
});

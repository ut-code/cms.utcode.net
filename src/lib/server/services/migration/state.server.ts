/**
 * Migration state machine actor
 *
 * A class-based actor that encapsulates state and processes events synchronously.
 * Effects are returned from transitions and executed by the caller.
 */

import type {
  MigrationEvent,
  MigrationOperation,
  MigrationResults,
  MigrationState,
} from "$lib/shared/types/migration";

// Effect types - async work to be done after state transition
export type MigrationEffect =
  | { type: "RUN_MIGRATION" }
  | { type: "RUN_CLEANUP" }
  | { type: "RUN_DELETE" }
  | null;

// Subscriber callback type
type Subscriber = (state: MigrationState, newLogs: string[]) => void;

function formatTimestamp(): string {
  return new Date().toISOString().slice(11, 19);
}

function operationLabel(operation: MigrationOperation): string {
  switch (operation) {
    case "migrate":
      return "Data Migration";
    case "cleanup":
      return "Image URL Cleanup";
    case "delete":
      return "Delete All Data";
  }
}

function operationToEffect(operation: MigrationOperation): MigrationEffect {
  switch (operation) {
    case "migrate":
      return { type: "RUN_MIGRATION" };
    case "cleanup":
      return { type: "RUN_CLEANUP" };
    case "delete":
      return { type: "RUN_DELETE" };
  }
}

/**
 * Migration Actor - encapsulates state and handles events
 */
class MigrationActor {
  private state: MigrationState = {
    status: "idle",
    logs: [],
    startedAt: null,
    completedAt: null,
    result: null,
    error: null,
  };

  private readonly subscribers = new Set<Subscriber>();

  /**
   * Send an event to the actor
   * Returns the effect to execute (if any) and whether operation started
   */
  send(event: MigrationEvent): { effect: MigrationEffect; started: boolean } {
    const prevLogCount = this.state.logs.length;
    const result = this.transition(event);

    // Notify subscribers with only new logs
    const newLogs = this.state.logs.slice(prevLogCount);
    this.notifySubscribers(newLogs);

    return result;
  }

  /**
   * Get current state (immutable copy)
   */
  getState(): MigrationState {
    return { ...this.state, logs: [...this.state.logs] };
  }

  /**
   * Get logs starting from a cursor (for diffing)
   */
  getLogsSince(cursor: number): { logs: string[]; cursor: number } {
    return {
      logs: this.state.logs.slice(cursor),
      cursor: this.state.logs.length,
    };
  }

  /**
   * Check if currently running
   */
  isRunning(): boolean {
    return this.state.status === "running";
  }

  /**
   * Subscribe to state changes
   * Returns unsubscribe function
   */
  subscribe(callback: Subscriber): () => void {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  /**
   * Get current subscriber count (for debugging)
   */
  getSubscriberCount(): number {
    return this.subscribers.size;
  }

  // ============================================================================
  // Convenience methods for common events
  // ============================================================================

  log(message: string): void {
    this.send({ type: "LOG", message });
  }

  complete(result: MigrationResults): void {
    this.send({ type: "COMPLETE", result });
  }

  fail(error: string): void {
    this.send({ type: "FAIL", error });
  }

  reset(): void {
    this.send({ type: "RESET" });
  }

  // ============================================================================
  // Private methods
  // ============================================================================

  private transition(event: MigrationEvent): { effect: MigrationEffect; started: boolean } {
    switch (event.type) {
      case "START":
        return this.handleStart(event.operation);
      case "LOG":
        return this.handleLog(event.message);
      case "COMPLETE":
        return this.handleComplete(event.result);
      case "FAIL":
        return this.handleFail(event.error);
      case "RESET":
        return this.handleReset();
    }
  }

  private handleStart(operation: MigrationOperation): {
    effect: MigrationEffect;
    started: boolean;
  } {
    if (this.state.status === "running") {
      return { effect: null, started: false };
    }

    this.state = {
      status: "running",
      logs: [`[${formatTimestamp()}] === ${operationLabel(operation)} Started ===`],
      startedAt: new Date(),
      completedAt: null,
      result: null,
      error: null,
    };

    return { effect: operationToEffect(operation), started: true };
  }

  private handleLog(message: string): { effect: MigrationEffect; started: boolean } {
    if (this.state.status !== "running") {
      return { effect: null, started: false };
    }

    this.state = {
      ...this.state,
      logs: [...this.state.logs, `[${formatTimestamp()}] ${message}`],
    };

    return { effect: null, started: false };
  }

  private handleComplete(result: MigrationResults): { effect: MigrationEffect; started: boolean } {
    if (this.state.status !== "running") {
      return { effect: null, started: false };
    }

    this.state = {
      ...this.state,
      status: "completed",
      completedAt: new Date(),
      result,
      logs: [...this.state.logs, `[${formatTimestamp()}] === Operation Complete ===`],
    };

    return { effect: null, started: false };
  }

  private handleFail(error: string): { effect: MigrationEffect; started: boolean } {
    if (this.state.status !== "running") {
      return { effect: null, started: false };
    }

    this.state = {
      ...this.state,
      status: "error",
      completedAt: new Date(),
      error,
      logs: [...this.state.logs, `[${formatTimestamp()}] === Operation Failed: ${error} ===`],
    };

    return { effect: null, started: false };
  }

  private handleReset(): { effect: MigrationEffect; started: boolean } {
    if (this.state.status === "running") {
      return { effect: null, started: false };
    }

    this.state = {
      status: "idle",
      logs: [],
      startedAt: null,
      completedAt: null,
      result: null,
      error: null,
    };

    return { effect: null, started: false };
  }

  private notifySubscribers(newLogs: string[]): void {
    const snapshot = this.getState();
    for (const subscriber of this.subscribers) {
      try {
        subscriber(snapshot, newLogs);
      } catch {
        this.subscribers.delete(subscriber);
      }
    }
  }
}

// Singleton actor instance
export const migrationActor = new MigrationActor();

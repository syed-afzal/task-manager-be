
// Add this declaration
declare module 'express' {
  interface Request {
    user?: {
      userId: string;
    };
  }
}
export interface Task {
  _id: string
  title: string
  checklist: { text: string; isCompleted: boolean }[]
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
      };
    }
  }
}
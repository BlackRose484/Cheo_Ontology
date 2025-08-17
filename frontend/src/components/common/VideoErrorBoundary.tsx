"use client";

import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class VideoErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Video Error Boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">❌</div>
              <p className="text-gray-600">Lỗi tải video</p>
              <button
                onClick={() => this.setState({ hasError: false })}
                className="mt-2 px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 text-sm"
              >
                Thử lại
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default VideoErrorBoundary;

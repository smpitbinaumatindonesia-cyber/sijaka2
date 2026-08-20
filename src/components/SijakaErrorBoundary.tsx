import React from 'react';
import { AlertTriangle, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { SijakaRole } from '../types';

export interface SijakaErrorBoundaryProps {
  children: React.ReactNode;
  sectionName?: string;
  userRole?: SijakaRole;
  onReset?: () => void;
}

export interface SijakaErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  showDetails: boolean;
}

export class SijakaErrorBoundary extends React.Component<SijakaErrorBoundaryProps, SijakaErrorBoundaryState> {
  constructor(props: SijakaErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false
    };
  }

  public static getDerivedStateFromError(error: Error): Partial<SijakaErrorBoundaryState> {
    return {
      hasError: true,
      error
    };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });
  }

  public handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false
    });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public render() {
    if (this.state.hasError) {
      const isAdmin = this.props.userRole === 'Admin' || this.props.userRole === 'Super Admin';

      return (
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 text-center my-4 shadow-xl max-w-xl mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-3">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <h3 className="text-sm sm:text-base font-bold text-white mb-1">
            Terjadi masalah saat memuat {this.props.sectionName || 'bagian ini'}.
          </h3>
          <p className="text-xs text-slate-400 mb-4 max-w-md mx-auto">
            Sistem mendeteksi kendala sementara. Anda dapat mencoba memuat ulang tampilan tanpa mempengaruhi data Anda.
          </p>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={this.handleRetry}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-900/40 active:scale-95 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Coba Lagi</span>
            </button>
          </div>

          {/* Technical Diagnostics (Admin Only) */}
          {isAdmin && this.state.error && (
            <div className="mt-4 pt-3 border-t border-slate-800 text-left">
              <button
                onClick={() => this.setState(prev => ({ showDetails: !prev.showDetails }))}
                className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 font-mono mx-auto"
              >
                <span>Diagnostik Teknis (Admin)</span>
                {this.state.showDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>

              {this.state.showDetails && (
                <div className="mt-2 p-3 rounded-lg bg-slate-950 border border-slate-800 text-[10px] font-mono text-rose-300 overflow-x-auto max-h-40">
                  <div className="font-bold">{this.state.error.toString()}</div>
                  {this.state.errorInfo?.componentStack && (
                    <pre className="text-slate-400 mt-1 text-[9px]">{this.state.errorInfo.componentStack}</pre>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

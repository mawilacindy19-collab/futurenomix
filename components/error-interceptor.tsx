'use client';

import { useEffect } from 'react';

// Safe stringifier helper for logging to prevent circular structures and DOM/React internals from throwing
function safeLogParam(arg: any): any {
  try {
    if (arg === null || arg === undefined) return arg;
    if (arg instanceof Error) {
      return arg.stack || arg.message || String(arg);
    }
    if (typeof arg === 'object') {
      // Filter out DOM nodes
      if (typeof Element !== 'undefined' && arg instanceof Element) {
        return `[HTML Element: <${arg.tagName.toLowerCase()}>]`;
      }
      if (arg.constructor && typeof arg.constructor.name === 'string' && arg.constructor.name.startsWith('HTML')) {
        return `[HTML Object: ${arg.constructor.name}]`;
      }
      if (typeof arg.nodeType === 'number' && typeof arg.nodeName === 'string') {
        return `[DOM Node: ${arg.nodeName}]`;
      }

      // Filter out React elements and internals
      if (arg.$$typeof) {
        return '[React Element]';
      }
      if (arg._reactName) {
        return '[React Event]';
      }

      try {
        const cache = new Set();
        const safeObjString = JSON.stringify(arg, (key, value) => {
          if (typeof value === 'object' && value !== null) {
            if (cache.has(value)) {
              return '[Circular]';
            }
            cache.add(value);
            if (typeof Element !== 'undefined' && value instanceof Element) {
              return '[HTML Element]';
            }
            if (value.constructor && typeof value.constructor.name === 'string' && value.constructor.name.startsWith('HTML')) {
              return '[HTML Element]';
            }
            if (value.$$typeof) {
              return '[React Element]';
            }
            if (value._owner !== undefined || value.stateNode !== undefined || value.memoizedState !== undefined) {
              return '[React Internal]';
            }
            try {
              const keys = Object.keys(value);
              if (keys.some(k => k.startsWith('__reactFiber') || k.startsWith('__reactEvents') || k.startsWith('__reactProps'))) {
                return '[React Fiber]';
              }
            } catch (e) {
              return '[Object]';
            }
          }
          return value;
        });
        return safeObjString || '[Object]';
      } catch (err) {
        return arg;
      }
    }
    return arg;
  } catch (e) {
    return '[Unstringifiable Object]';
  }
}

export function ErrorInterceptor() {
  useEffect(() => {
    // Intercept console.error
    const originalError = console.error;
    console.error = (...args) => {
      const safeArgs = args.map(safeLogParam);
      originalError.apply(console, safeArgs as any);
    };

    // Intercept console.warn
    const originalWarn = console.warn;
    console.warn = (...args) => {
      const safeArgs = args.map(safeLogParam);
      originalWarn.apply(console, safeArgs as any);
    };

    // Intercept console.log
    const originalLog = console.log;
    console.log = (...args) => {
      const safeArgs = args.map(safeLogParam);
      originalLog.apply(console, safeArgs as any);
    };

    // Auto-recovery for Next.js ChunkLoadError and network desync
    const tryReloadChunk = () => {
      try {
        const lastReload = sessionStorage.getItem('orbit_last_chunk_reload');
        const now = Date.now();
        if (!lastReload || now - parseInt(lastReload, 10) > 8000) {
          sessionStorage.setItem('orbit_last_chunk_reload', String(now));
          window.location.reload();
          return true;
        }
      } catch (err) {
        window.location.reload();
        return true;
      }
      return false;
    };

    // Global Error Handlers using our safe sanitizer
    const handler = (e: any) => {
      // If it is an asset loading error (e.g., img, video, script tag failed to load)
      if (e && e.target && e.target !== window && e.target !== document) {
        const tagName = e.target.tagName ? e.target.tagName.toLowerCase() : 'element';
        const src = e.target.src || e.target.href || '';
        if (tagName === 'script' && src.includes('/_next/static/chunks/')) {
          if (tryReloadChunk()) return;
        }
        originalWarn(`Asset failed to load: <${tagName}> with source "${src}"`);
        return;
      }

      const errMsg = e.message || (e.error && e.error.message) || String(e || '');
      const filename = e.filename || '';

      // Intercept chunk loading and script execution mismatch errors
      if (
        errMsg.includes('ChunkLoadError') ||
        errMsg.includes('Loading chunk') ||
        (filename && filename.includes('/_next/static/chunks/')) ||
        (errMsg.includes('Invalid or unexpected token') && (filename.includes('_next') || window.location.pathname.startsWith('/feed')))
      ) {
        if (tryReloadChunk()) {
          return;
        }
      }

      try {
        e.preventDefault();
      } catch (err) {}
      originalError('Global Error Captured:', errMsg);
    };

    const rejectionHandler = (e: PromiseRejectionEvent) => {
      const reason = e.reason;
      const reasonMsg = (reason && (reason.message || reason.stack)) || String(reason || '');
      if (reasonMsg.includes('ChunkLoadError') || reasonMsg.includes('Loading chunk')) {
        e.preventDefault();
        if (tryReloadChunk()) return;
      }

      e.preventDefault();
      const safeReason = safeLogParam(e.reason);
      originalError('Unhandled Rejection Captured:', safeReason);
    };

    window.addEventListener('error', handler, true);
    window.addEventListener('unhandledrejection', rejectionHandler, true);

    return () => {
      console.error = originalError;
      console.warn = originalWarn;
      console.log = originalLog;
      window.removeEventListener('error', handler, true);
      window.removeEventListener('unhandledrejection', rejectionHandler, true);
    };
  }, []);

  return null;
}


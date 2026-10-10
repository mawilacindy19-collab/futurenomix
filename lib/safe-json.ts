export function safeJsonParse<T = any>(str: string | null | undefined, fallback: T): T {
  if (!str) return fallback;
  try {
    return JSON.parse(str);
  } catch (e) {
    return fallback;
  }
}

export function safeStringify(obj: any): string {
  const cache = new Set();
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (cache.has(value)) {
        return undefined; // circular reference
      }
      cache.add(value);
      
      // Filter out DOM nodes
      if (typeof Element !== 'undefined' && value instanceof Element) {
        return undefined;
      }
      if (value.constructor && typeof value.constructor.name === 'string' && value.constructor.name.startsWith('HTML')) {
        return undefined;
      }
      if (typeof value.nodeType === 'number' && typeof value.nodeName === 'string') {
        return undefined;
      }

      // Filter out React elements and internals
      if (value.$$typeof) {
        return undefined;
      }
      if (value._owner !== undefined) {
        return undefined;
      }
      if (
        value.stateNode !== undefined || 
        value.memoizedState !== undefined || 
        value.memoizedProps !== undefined || 
        value.updateQueue !== undefined
      ) {
        if (value.constructor && typeof value.constructor.name === 'string' && (value.constructor.name.includes('Fiber') || value.constructor.name.includes('Component'))) {
          return undefined;
        }
      }

      try {
        const keys = Object.keys(value);
        if (keys.some(k => k.startsWith('__reactFiber') || k.startsWith('__reactEvents') || k.startsWith('__reactProps'))) {
          return undefined;
        }
      } catch (e) {
        return undefined;
      }
    }
    return value;
  });
}


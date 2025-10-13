// 🔥 Logger Shared Utilities

/**
 * Extract component name from string or symbol
 * Supports both Symbol.for() registered symbols and local symbols
 * 
 * @param component - Component identifier (string or symbol)
 * @returns String representation of component name
 * 
 * @example
 * getComponentName('MY_COMPONENT') // 'MY_COMPONENT'
 * getComponentName(Symbol.for('MY_COMPONENT')) // 'MY_COMPONENT'
 * getComponentName(Symbol('LOCAL')) // 'LOCAL'
 */
export function getComponentName(component: string | symbol): string {
  if (typeof component === 'symbol') {
    // Try Symbol.for registered key first (most common case)
    const key = Symbol.keyFor(component);
    if (key) return key;
    
    // Fallback to symbol description
    const desc = component.description;
    if (desc) return desc;
    
    // Last resort for symbols without description
    return 'UNKNOWN_SYMBOL';
  }
  
  return component;
}

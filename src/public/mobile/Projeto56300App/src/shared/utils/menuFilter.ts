/**
 * matchesRole
 *
 * Formats supported:
 *   ["*"]                    → any role passes (wildcard)
 *   ["admin", "user"]        → inclusion: passes if userRole is in the list
 *   ["!admin"]               → exclusion: passes if userRole is NOT in the negated list
 *
 * Rule: if every entry starts with "!" → exclusion mode.
 *       otherwise → inclusion mode. Never mix both in the same array.
 */
export function matchesRole(allowedRoles: string[], userRole: string): boolean {
  if (allowedRoles.includes('*')) return true

  const isExclusionMode = allowedRoles.length > 0 && allowedRoles.every(r => r.startsWith('!'))

  if (isExclusionMode) {
    return !allowedRoles.includes(`!${userRole}`)
  }

  return allowedRoles.includes(userRole)
}

/**
 * matchesRoute
 *
 * Formats supported:
 *   ["*"]                    → any route passes (wildcard)
 *   ["Messaging"]            → inclusion: passes if currentRoute is in the list
 *   ["!Messaging"]           → exclusion: passes if currentRoute is NOT in the negated list
 *
 * Note: route names are case-sensitive. "Messaging" ≠ "messaging".
 */
export function matchesRoute(visibleOnRoutes: string[], currentRoute: string): boolean {
  if (visibleOnRoutes.includes('*')) return true

  const isExclusionMode = visibleOnRoutes.length > 0 && visibleOnRoutes.every(r => r.startsWith('!'))

  if (isExclusionMode) {
    return !visibleOnRoutes.some(r => {
      const route = r.slice(1)
      return currentRoute === route || currentRoute.startsWith(route + '/')
    })
  }

  return visibleOnRoutes.some(route =>
    currentRoute === route || currentRoute.startsWith(route + '/')
  )
}

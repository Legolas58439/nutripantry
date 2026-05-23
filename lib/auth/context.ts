// The AUTH SEAM.
//
// Right now Nutripantry has no login, so everything belongs to a single
// pretend user called "local". Every data function asks this helper "who is
// the current owner?" before reading or writing.
//
// When we add real authentication later, THIS is the only function that
// changes — it'll return the signed-in user's id instead of "local", and the
// entire app instantly becomes per-user. That's why we route every query
// through it from day one.
export function getCurrentOwnerId(): string {
  return "local";
}

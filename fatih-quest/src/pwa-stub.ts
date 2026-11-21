// Vervangt de service worker in de losse-bestandversie (offline werkt die al, want alles zit in één bestand).
export function registerSW(_opts?: unknown) {
  return async (_reload?: boolean) => {};
}

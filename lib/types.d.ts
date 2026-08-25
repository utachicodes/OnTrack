export {}

declare global {
  interface Window {
    deferredInstallPrompt?: BeforeInstallPromptEvent
  }

  interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
  }
}

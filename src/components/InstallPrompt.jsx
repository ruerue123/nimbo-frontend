import React, { useEffect, useState } from 'react';
import { FaDownload, FaTimes } from 'react-icons/fa';

// Lightweight A2HS prompt. We listen for `beforeinstallprompt` (Chrome/Edge,
// Android), defer the event, and surface our own button. On iOS Safari the
// event never fires — we show a one-time inline tip telling users how to
// install via the share sheet. Either tip auto-dismisses after the user taps
// it; we remember the dismissal in localStorage so we don't nag.

const DISMISS_KEY = 'nimbo:install-dismissed';

const ios =
    typeof navigator !== 'undefined' &&
    /iPad|iPhone|iPod/.test(navigator.userAgent) &&
    !window.MSStream;

const standalone =
    (typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches) ||
    (typeof navigator !== 'undefined' && navigator.standalone);

const InstallPrompt = () => {
    const [deferredEvent, setDeferredEvent] = useState(null);
    const [showIosTip, setShowIosTip] = useState(false);

    useEffect(() => {
        if (standalone) return;
        if (localStorage.getItem(DISMISS_KEY)) return;

        const onBeforeInstall = (e) => {
            e.preventDefault();
            setDeferredEvent(e);
        };
        window.addEventListener('beforeinstallprompt', onBeforeInstall);

        // iOS never fires beforeinstallprompt — show a manual tip after a
        // brief delay so the user has settled into the app.
        if (ios) {
            const t = setTimeout(() => setShowIosTip(true), 4000);
            return () => {
                clearTimeout(t);
                window.removeEventListener('beforeinstallprompt', onBeforeInstall);
            };
        }
        return () => window.removeEventListener('beforeinstallprompt', onBeforeInstall);
    }, []);

    const dismiss = () => {
        localStorage.setItem(DISMISS_KEY, '1');
        setDeferredEvent(null);
        setShowIosTip(false);
    };

    const install = async () => {
        if (!deferredEvent) return;
        deferredEvent.prompt();
        await deferredEvent.userChoice.catch(() => {});
        dismiss();
    };

    if (standalone) return null;
    if (deferredEvent) {
        return (
            <div className='fixed left-3 right-3 bottom-3 md:left-auto md:right-6 md:bottom-6 md:max-w-sm z-[60] bg-white border border-gray-200 rounded-2xl shadow-lg p-4 flex items-center gap-3'
                 style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
                <div className='w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0'>
                    <FaDownload />
                </div>
                <div className='flex-1 min-w-0'>
                    <p className='font-semibold text-gray-900 text-sm'>Install Nimbo</p>
                    <p className='text-xs text-gray-500'>Add the app to your home screen for a faster experience.</p>
                </div>
                <button onClick={install} className='shrink-0 px-3 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-600 text-white text-sm font-semibold'>
                    Install
                </button>
                <button onClick={dismiss} aria-label='Dismiss' className='shrink-0 w-8 h-8 rounded-lg text-gray-400 hover:bg-gray-100 flex items-center justify-center'>
                    <FaTimes />
                </button>
            </div>
        );
    }
    if (showIosTip) {
        return (
            <div className='fixed left-3 right-3 bottom-3 md:left-auto md:right-6 md:bottom-6 md:max-w-sm z-[60] bg-white border border-gray-200 rounded-2xl shadow-lg p-4'
                 style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
                <div className='flex items-start gap-3'>
                    <div className='w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0'>
                        <FaDownload />
                    </div>
                    <div className='flex-1 min-w-0'>
                        <p className='font-semibold text-gray-900 text-sm'>Install Nimbo</p>
                        <p className='text-xs text-gray-500 mt-0.5'>
                            Tap <span className='font-semibold'>Share</span>, then <span className='font-semibold'>Add to Home Screen</span>.
                        </p>
                    </div>
                    <button onClick={dismiss} aria-label='Dismiss' className='shrink-0 w-8 h-8 rounded-lg text-gray-400 hover:bg-gray-100 flex items-center justify-center'>
                        <FaTimes />
                    </button>
                </div>
            </div>
        );
    }
    return null;
};

export default InstallPrompt;

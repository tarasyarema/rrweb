import { EventType, record } from 'rrweb';
import type { recordOptions } from 'rrweb';
import type { eventWithTime } from '@rrweb/types';
import { MessageName, type RecordStartedMessage } from '~/types';
import { isInCrossOriginIFrame } from '~/utils';

/**
 * This script is injected into both main page and cross-origin IFrames through <script> tags.
 */

let stopFn: (() => void) | null = null;

function startRecord(config: recordOptions<eventWithTime>) {
  stopFn =
    record({
      emit: (event) => {
        postMessage({
          message: MessageName.EmitEvent,
          event,
        });
      },
      userTriggeredOnInput: true,
      recordDOM: true,
      recordCanvas: true,
      recordCrossOriginIframes: true,
      ...config,
    }) || null;
  postMessage({
    message: MessageName.RecordStarted,
    startTimestamp: Date.now(),
  } as RecordStartedMessage);
}

const messageHandler = (
  event: MessageEvent<{
    message: MessageName;
    config?: recordOptions<eventWithTime>;
  }>,
) => {
  if (event.source !== window) return;
  const data = event.data;
  const eventHandler = {
    [MessageName.StartRecord]: () => {
      startRecord(data.config || {});
    },
    [MessageName.StopRecord]: () => {
      if (stopFn) {
        try {
          stopFn();
        } catch (e) {
          //
        }
      }
      postMessage({
        message: MessageName.RecordStopped,
        endTimestamp: Date.now(),
      });
      window.removeEventListener('message', messageHandler);
    },
  } as Record<MessageName, () => void>;
  if (eventHandler[data.message]) eventHandler[data.message]();
};

/**
 * Only post message in the main page.
 */
function postMessage(message: unknown) {
  if (!isInCrossOriginIFrame()) window.postMessage(message, location.origin);
}

document.addEventListener('keydown', (e) => {
  const event: eventWithTime = {
    timestamp: Math.floor(performance.timeOrigin + e.timeStamp),
    type: EventType.Custom,
    data: {
      tag: 'custom-keydown',
      payload: {
        isTrusted: e.isTrusted,
        key: e.key,
        code: e.code,
        location: e.location,
        ctrlKey: e.ctrlKey,
        shiftKey: e.shiftKey,
        altKey: e.altKey,
        metaKey: e.metaKey,
        repeat: e.repeat,
        isComposing: e.isComposing,
        modifierState: {
          AltGraph: e.getModifierState('AltGraph'),
          CapsLock: e.getModifierState('CapsLock'),
          Fn: e.getModifierState('Fn'),
          FnLock: e.getModifierState('FnLock'),
          NumLock: e.getModifierState('NumLock'),
          ScrollLock: e.getModifierState('ScrollLock'),
          Symbol: e.getModifierState('Symbol'),
          SymbolLock: e.getModifierState('SymbolLock')
        },
      },
    }
  };

  postMessage({
    message: MessageName.EmitEvent,
    event
  });
});


window.addEventListener('message', messageHandler);

window.postMessage(
  {
    message: MessageName.RecordScriptReady,
  },
  location.origin,
);

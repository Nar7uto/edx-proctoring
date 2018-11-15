import MockProctoringEventHandler from 'mockprock';

const handler = new MockProctoringEventHandler();

self.addEventListener("message", (message) => {
  switch(message.data.type) {
    case 'startExam': {
      handler.onStartExam().then(() => self.postMessage({type: 'examStarted'}))
    }
    case 'endExam': {
      handler.onEndExam().then(() => self.postMessage({type: 'examEnded'}))
    }
    case 'ping': {
      handler.onPing().then(() => self.postMessage({type: 'echo'}))
    }
  }
});

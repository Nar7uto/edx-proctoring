var edx = edx || {};

(function($) {
  'use strict';

  var actionToMessageTypesMap = {
    'submit': {
      promptEventName: 'endExamAttempt',
      responseEventName: 'examAttemptEnded'
    },
    'start': {
      promptEventName: 'startExamAttempt',
      responseEventName: 'examAttemptStarted'
    }
  };

  function workerPromiseForEventNames(eventNames) {
    return function() {
      var proctoringBackendWorker = new Worker(edx.courseware.proctored_exam.configuredWorkerURL);
      return new Promise(function(resolve) {
        var responseHandler = function(e) {
          if (e.data.type === eventNames.responseEventName) {
            proctoringBackendWorker.removeEventListener('message', responseHandler);
            proctoringBackendWorker.terminate();
            resolve();
          }
        };
        proctoringBackendWorker.addEventListener('message', responseHandler);
        proctoringBackendWorker.postMessage({ type: eventNames.promptEventName});
      });
    };
  }

  // Update the state of the attempt
  function updateExamAttemptStatusPromise(actionUrl, action) {
    return Promise.resolve($.ajax({
      url: actionUrl,
      type: 'PUT',
      data: {
        action: action
      }
    }));
  }

  function reloadPage() {
    location.reload();
  }


  edx.courseware = edx.courseware || {};
  edx.courseware.proctored_exam = edx.courseware.proctored_exam || {};
  edx.courseware.proctored_exam.examActionHandler = function() {
    // cancel any warning messages to end user about leaving timed exam
    $(window).unbind('beforeunload');

    var $this = $(this);
    var actionUrl = $this.data('change-state-url');
    var action = $this.data('action');

    var shouldUseWorker = window.Worker && edx.courseware.proctored_exam.configuredWorkerURL;
    if(shouldUseWorker) {
      updateExamAttemptStatusPromise(actionUrl, action).then(workerPromiseForEventNames(actionToMessageTypesMap[action])).then(reloadPage);
    } else {
      updateExamAttemptStatusPromise().then(reloadPage);
    }
  };

}).call(this, $);

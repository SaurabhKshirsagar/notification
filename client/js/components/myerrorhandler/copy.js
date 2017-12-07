

let deselectCurrent = function () {
  let selection = document.getSelection();
  if (!selection.rangeCount) {
    return function () {};
  }
  let active = document.activeElement;

  let ranges = [];
  for (let i = 0; i < selection.rangeCount; i++) {
    ranges.push(selection.getRangeAt(i));
  }

  switch (active.tagName.toUpperCase()) { 
    case 'INPUT':
    case 'TEXTAREA':
      active.blur();
      break;

    default:
      active = null;
      break;
  }

  selection.removeAllRanges();
  return function () {
    selection.type === 'Caret' &&
    selection.removeAllRanges();

    if (!selection.rangeCount) {
      ranges.forEach(function(range) {
        selection.addRange(range);
      });
    }

    active &&
    active.focus();
  };
}

let format=function (message) {
  let copyKey = (/mac os x/i.test(navigator.userAgent) ? '⌘' : 'Ctrl') + '+C';
  return message.replace(/#{\s*key\s*}/g, copyKey);
}

let copy=function (text, options) {
  let debug, message, reselectPrevious, range, selection, mark, success = false;
  if (!options) { options = {}; }
  debug = options.debug || false;
  try {
    reselectPrevious = deselectCurrent();

    range = document.createRange();
    selection = document.getSelection();

    mark = document.createElement('span');
    mark.textContent = text;
    mark.setAttribute('style', [
      // reset user styles for span element
      'all: unset',
      // prevents scrolling to the end of the page
      'position: fixed',
      'top: 0',
      'clip: rect(0, 0, 0, 0)',
      // used to preserve spaces and line breaks
      'white-space: pre',
      // do not inherit user-select (it may be `none`)
      '-webkit-user-select: text',
      '-moz-user-select: text',
      '-ms-user-select: text',
      'user-select: text',
    ].join(';'));

    document.body.appendChild(mark);

    range.selectNode(mark);
    selection.addRange(range);

    let successful = document.execCommand('copy');
    if (!successful) {
      throw new Error('copy command was unsuccessful');
    }
    success = true;
  } catch (err) {
    debug && console.error('unable to copy using execCommand: ', err);
    debug && console.warn('trying IE specific stuff');
    try {
      window.clipboardData.setData('text', text);
      success = true;
    } catch (err) {
      debug && console.error('unable to copy using clipboardData: ', err);
      debug && console.error('falling back to prompt');
      message = format('message' in options ? options.message : "copy");
      window.prompt(message, text);
    }
  } finally {
    if (selection) {
      if (typeof selection.removeRange == 'function') {
        selection.removeRange(range);
      } else {
        selection.removeAllRanges();
      }
    }

    if (mark) {
      document.body.removeChild(mark);
    }
    reselectPrevious();
  }

  return success;
}

export default copy;
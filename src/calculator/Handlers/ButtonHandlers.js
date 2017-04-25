import LogicUnit from '../Logic/LogicUnit';

const logic = new LogicUnit();

const refreshHandler = (outputWindow: HTMLElement) => (msg: ?string): void => {
  if (outputWindow)
    outputWindow.textContent = msg || logic.getExpression();
};

/* called when used selects a glyph */
function keyPresshandler = (outputWindow: HTMLElement) => (val: Event): void {
  const { key } = val.target.dataset;
	const refresh = refreshHandler(outputWindow);

  switch (key) {
    case '=':
      refresh(logic.compute());

      break;

    case 'clear':
      logic.clear();
      refresh();

      break;

    case 'delete':
      logic.delete();
      refresh();

      break;

    default:
      logic.update(key);
      refresh();

      break;
  }
}

export {
	refreshHandler,
	keyPressHandler,
}

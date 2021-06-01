export const styles = {
  main: ['background-color: green'],
  worker: ['background-color: blue'],
  base: ['color: #fff', 'background-color: #444', 'padding: 2px 4px', 'border-radius: 2px'],
};

export const log = (text, extra = []) => {
  let style = styles.base.join(';') + ';';
  style += extra.join(';');
  console.log(`%c${text}`, style);
};

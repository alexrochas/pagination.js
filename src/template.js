import h from 'virtual-dom/h';
import diff from 'virtual-dom/diff';
import patch from 'virtual-dom/patch';
import createElement from 'virtual-dom/create-element';

export default class Template {

  constructor(onNextPage, onClickPage, onPreviousPage) {
    this.onClickPage = onClickPage;
    this.onNextPage = onNextPage;
    this.onPreviousPage = onPreviousPage;
  }

  renderPage = (page, onClick, className, disabled = false) => {
    return h('li', {
      'className': className,
    }, h(
      'button',
      {
        disabled,
        'onclick': onClick,
      },
      page
    ));
  };

  renderPages = (pages, currentPage = null) => {
    const defaultClassName = 'pagination__pages__page';

    return pages.map((content, page) => {
      let className = currentPage == page ? defaultClassName + ' pagination__pages__page--active' : defaultClassName;
      let disabled = currentPage == page ? true : false;
      return this.renderPage(page, this.onClickPage.bind(this, page, this.update), className, disabled);
    });
  };

  renderPreviousPage = (hasPreviousPage) => {
    let className = 'pagination__pages__page pagination__pages__page--previous';
    let disabled = false;

    if(! hasPreviousPage) {
      className+= ' pagination__pages__page--disabled';
      disabled = true;
    }

    return this.renderPage('«', this.onPreviousPage.bind(this, this.update), className, disabled);
  };

  renderNextPage = (hasNextPage) => {
    let className = 'pagination__pages__page pagination__pages__page--next';
    let disabled = false;

    if(! hasNextPage) {
      className+= ' pagination__pages__page--disabled';
      disabled = true;
    }

    return this.renderPage('»', this.onNextPage.bind(this, this.update), className, disabled);
  };

  renderContent = (content) => {
    return h('div', {
      'className': 'pagination__content',
    }, content);
  };

  render = ({ pages, currentContent, currentPage, hasNextPage, hasPreviousPage }, element) => {

    const tree = h('div', {
      'className': 'pagination',
    }, [
      h('div', {
        'className': 'pagination__content',
      }, currentContent),
      h('ul', {
        'className': 'pagination__pages',
      }, [
        this.renderPreviousPage(hasPreviousPage),
        this.renderPages(pages, currentPage),
        this.renderNextPage(hasNextPage),
      ])
    ]);

    if(element) {
      this.tree = tree;
      this.node = createElement(this.tree);
      element.appendChild(this.node);
    }

    return tree;
  };

  update = (values) => {
    const newTree = this.render(values);
    const patches = diff(this.tree, newTree);
    this.node = patch(this.node, patches);
    this.tree = newTree;
  };

}

import utils from './utils';
import Template from './template';
import Emitter from 'tiny-emitter';

export default class Pagination extends Emitter {

  constructor(element, data, perPage = 1) {
    super();

    this.setData(data, perPage);
    this.goToPage(1);

    const template = new Template(this.nextPage, this.goToPage, this.previousPage);
    template.render({
      'pages': this.pages,
      'currentPage': this.page,
      'hasNextPage': this.hasPage(this.page + 1),
      'hasPreviousPage': this.hasPage(this.page - 1),
    }, element);
  }

  setData = (data, perPage = this.perPage) => {
    this.setPerPage(perPage);
    this.pages = utils.split(data, this.perPage);

    return this;
  };

  setPerPage = (perPage) => {
    this.perPage = perPage;

    return this;
  };

  size = () => {
    return this.pages.length;
  };

  hasPage = (page) => {
    return page > 0 && page < this.size();
  };

  getPage = (page) => {
    if(! this.hasPage(page))
      throw new RangeError('Page not exist');

    return this.pages[page];
  };

  goToPage = (page, callback = null) => {
    if(! this.hasPage(page))
      throw new RangeError('Page not exist');

    this.page = page;

    const newValues = {
      'pages': this.pages,
      'currentContent': this.getPage(this.page),
      'currentPage': this.page,
      'hasNextPage': this.hasPage(this.page + 1),
      'hasPreviousPage': this.hasPage(this.page - 1),
    };

    this.emit('change', newValues);

    if(callback) {
      callback(newValues);
    }

    return this;
  };

  previousPage = (callback) => {
    this.goToPage(this.page - 1, callback);
  };

  currentPage = () => {
    return this.getPage(this.page);
  };

  nextPage = (callback) => {
    this.goToPage(this.page + 1, callback);
  };

}

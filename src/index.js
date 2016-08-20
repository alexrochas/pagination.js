import Pagination from './pagination';

window.Pagination = (element, pages, perPage) => {
  return new Pagination(element, pages, perPage);
}

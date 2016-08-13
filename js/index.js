$(document).ready(function() {
  /**
   * Prototype for pagination.
   * @param builds receives an array that will be splited in smaller arrays.
   * @param callback callback that will be called receiving a list when an action be triggered.
   * @param per_page define how many items per page.
   */
  function pagination(builds, callback, per_page) {
    this.index = 0;
    this.pages = split(builds, per_page);

    this.previous_page = function() {
      this.index--;
      var builds = this.pages[this.index];
      callback(builds);
      return builds;
    };

    this.actual_page = function() {
      var builds = this.pages[this.index];
      callback(builds);
      return builds;
    };

    this.next_page = function() {
      this.index++;
      var builds = this.pages[this.index];
      callback(builds);
      return builds;
    };

    this.get_page = function(index) {
      if (index >= 0 && index < this.pages.length) {
        this.index = index;
        return this.pages[this.index];
      }

      throw new RangeError("Index not exist");
    };

    this.go_to_page = function(index) {
      var builds = this.get_page(index);
      callback(builds);
      return builds;
    };

    this.has_next_page = function() {
      return this.pages[this.index + 1] != undefined;
    };

    this.has_previous_page = function() {
      return this.pages[this.index - 1] != undefined;
    };

    this.size = function() {
      return this.pages.length;
    }
  }

  /**
   * Function for split lists in smaller lists.
   * @param list original list to be splited.
   * @param offset size of the smaller lists.
   */
  function split(list, offset) {
    var lists = [];
    var partial_list = [];
    var iter_index = 1;

    for (var i = 0; list.length > i; i++) {
      partial_list.push(list[i]);
      if (iter_index % offset == 0) {
        lists.push(partial_list);
        partial_list = [];
        iter_index = 0;
      } else if (i == list.length - 1) {
        lists.push(partial_list);
      }
      iter_index++;
    }
    return lists;
  }

  /**
   * Verify if pagination has previous and next, setting to disabled the navigation buttons.
   */
  function verifyPaginationBorders() {
    if (pagination_.has_previous_page() != true) {
      $('#pagination-previous').addClass("disabled");
    } else {
      $('#pagination-previous').removeClass("disabled");
    }

    if (pagination_.has_next_page() != true) {
      $('#pagination-next').addClass("disabled");
    } else {
      $('#pagination-next').removeClass("disabled");
    }
  }

  /**
   * Function for represent an array index on interface.
   */
  function arrayIndexToInterfaceIndex(index) {
    return index + 1;
  }

  function updatePaginationBar() {
    $('.pagination').children().each(function() {
      var value = this;
      var actual_page_number = pagination_.index;
      if ($(value).attr('id') == actual_page_number) {
        $(value).addClass('active');
      } else {
        $(value).removeClass('active');
      }
    });
  }

  $('#pagination-bar').on('click', '.page', function(event) {
    event.stopPropagation();
    var target_page = $(event.target).parent().attr('id');

    pagination_.go_to_page(target_page);
    verifyPaginationBorders();
    updatePaginationBar();
  });

  $('#pagination-next a').on('click', function(event) {
    event.preventDefault();
    if (pagination_.has_next_page() == true) {
      pagination_.next_page();
    }
    verifyPaginationBorders();
    updatePaginationBar();
    return false;
  });

  $('#pagination-previous a').on('click', function(event) {
    event.preventDefault();
    if (pagination_.has_previous_page() == true) {
      pagination_.previous_page();
    }
    verifyPaginationBorders();
    updatePaginationBar();
    return false;
  });

  function dummyCallback(dummies) {
    $('#dummy-box').empty();
    for (var i in dummies) {
      var dummy = dummies[i];
      $('#dummy-box').append(
        "<ul>" + dummy + "</ul>"
      );
    }
  }

  var dummy_data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  pagination_ = new pagination(dummy_data, dummyCallback, 3);
  pagination_.actual_page();
  verifyPaginationBorders();

  $('#dummy-box').show();
  $('#pagination-bar').show();
  $('.pagination').children().each(function() {
    var value = this;
    if (!$(value).hasClass('prev') && !$(value).hasClass('next')) {
      $(value).remove();
    }
  });
  $('#pagination-previous').after(function() {
    var return_ = "";
    for (var i = 0; pagination_.size() > i; i++) {
      var actual_page = pagination_.actual_page(i);
      var page = pagination_.get_page(i);
      var interface_index = arrayIndexToInterfaceIndex(i);
      if (actual_page == page) {
        return_ += "<li class='active page' id='" + i + "'><a href='#'>" + interface_index + "</a></li>";
      } else {
        return_ += "<li class='page' id='" + i + "'><a href='#'>" + interface_index + "</a></li>";
      }
    }

    if (pagination_.size == 0) {
      return_ += "<li><span class=ellipsis>…</span></li>";
    }

    return return_;
  }(this));

  pagination_.go_to_page(0);

});
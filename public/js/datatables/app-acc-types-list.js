$(function () {
    ('use strict');
    var dtUserTable = $('.user-list-table'),
      select = $('.select2'),
      statusObj = {
        'Active': { title: 'Active', class: 'badge-light-success' },
        'Inactive': { title: 'Inactive', class: 'badge-light-secondary' }
      };
  
    select.each(function () {
      var $this = $(this);
      $this.wrap('<div class="position-relative"></div>');
      $this.select2({
        // the following code is used to disable x-scrollbar when click in select input and
        // take 100% width in responsive also
        dropdownAutoWidth: true,
        width: '100%',
        dropdownParent: $this.parent()
      });
    });
  
    // CMS List datatable
    if (dtUserTable.length) {
      dtUserTable.DataTable({
        paging: true,
        sorting: true,
        serverSide: true,
        ajax: {
          url: `${window.location.protocol}//${window.location.host}/account-types/getall`,
          method: 'post',
          dataFilter: function(data){
            var json = JSON.parse(data);
            json.recordsTotal = json.data.recordsTotal;
            json.recordsFiltered = json.data.recordsFiltered;
            json.data = json.data.data;
            return JSON.stringify(json);
          }
        },
        columns: [
          // columns according to JSON
          { data: '' },
          { data: 'title' },
          { data: 'description' },
          { data: 'status' },
          { data: '' }
        ],
        columnDefs: [
          {
            // For Responsive
            className: 'control',
            orderable: false,
            searchable: false,
            responsivePriority: 2,
            targets: 0,
            render: function (data, type, full, meta) {
              return '';
            }
          },
          {
            // title
            targets: 1,
            responsivePriority: 4,
            render: function (datas, type, full, meta) {
              /** Convert String To Binary Starts */
              let binary = '';
              for (var i = 0; i < full['description'].length; i++) {
                binary += full['description'][i].charCodeAt(0).toString(2) + " ";
              }
              /** Convert String To Binary Ends */
              // Creates full output for row
                let $row_output =
                  '<div class="d-flex justify-content-left align-items-center">' +
                  '<div class="d-flex flex-column">' +
                  '<span class="fw-bolder">' +
                  '<a href="javascript:;" data-id="edit-' + full['_id'] + 
                '" data-cmscontent="' + binary +
                '" data-cmstitle="' + full['title'] +
                '" class="text-truncate text-body edit-cms-modal" data-bs-toggle="modal" data-bs-target="#modals-slide-in">' +
                  full['title'] +
                  '</a></span>' +
                  '</div>' +
                  '</div>';
                return $row_output;
            }
          },
          {
            // description
            targets: 2,
            responsivePriority: 4,
            render: function (datas, type, full, meta) {
                let $row_output = full['description'];
                return $row_output;
            }
          },
          {
            // Status
            targets: 3,
            orderable: false,
            searchable: true,
            "className": "text-center",
            render: function (data, type, full, meta) {
              var $status = full['status'];
  
              return (
                '<span class="badge rounded-pill statusUpdate cursor-pointer ' +
                statusObj[$status].class +
                '" text-capitalized data-status="' + $status + '" data-id="' + full['_id'] + '">' +
                statusObj[$status].title +
                '</span>'
              );
            }
          },
          {
            // Actions
            targets: -1,
            title: 'Actions',
            orderable: false,
            searchable: false,
            render: function (data, type, full, meta) {
              /** Convert String To Binary Starts */
              let binary = '';
              for (var i = 0; i < full['description'].length; i++) {
                binary += full['description'][i].charCodeAt(0).toString(2) + " ";
              }
              /** Convert String To Binary Ends */
              return (
                '<div class="btn-group">' +
                '<a class="btn btn-sm dropdown-toggle hide-arrow" data-bs-toggle="dropdown">' +
                feather.icons['more-vertical'].toSvg({ class: 'font-small-4' }) +
                '</a>' +
                '<div class="dropdown-menu dropdown-menu-end">' +
                '<a href="javascript:;" data-id="edit-' + full['_id'] + 
                '" data-cmscontent="' + binary +
                '" data-cmstitle="' + full['title'] +
                '" class="dropdown-item edit-cms-modal" data-bs-toggle="modal" data-bs-target="#modals-slide-in">' +
                feather.icons['edit'].toSvg({ class: 'font-small-4 me-50' }) +
                'Edit</a>' +
                '<a href="javascript:;" id="del-' + full["_id"] + '" class="dropdown-item delete-record deleteType">' +
                feather.icons['trash-2'].toSvg({ class: 'font-small-4 me-50' }) +
                'Delete</a>' +
                '</div>' +
                '</div>'
              );
            }
          }
        ],
        order: [[1, 'asc']],
        dom:
          '<"d-flex justify-content-between align-items-center header-actions mx-2 row mt-75"' +
          '<"col-sm-12 col-lg-4 d-flex justify-content-center justify-content-lg-start" l>' +
          '<"col-sm-12 col-lg-8 ps-xl-75 ps-0"<"dt-action-buttons d-flex align-items-center justify-content-center justify-content-lg-end flex-lg-nowrap flex-wrap"<"me-1"f>B>>' +
          '>t' +
          '<"d-flex justify-content-between mx-2 row mb-1"' +
          '<"col-sm-12 col-md-6"i>' +
          '<"col-sm-12 col-md-6"p>' +
          '>',
        language: {
          sLengthMenu: 'Show _MENU_',
          search: 'Search',
          searchPlaceholder: 'Search..',
          "zeroRecords": "No data Found",
          "processing": 'Loading',
          paginate: {
            // remove previous & next text from pagination
            // previous: '&nbsp;',
            // next: '&nbsp;'
          }
        },
        // Buttons with Dropdown
        buttons: [
            // Add New Button
        {
            text: 'Add New',
            className: 'add-new btn btn-primary',
            attr: {
              'data-bs-toggle': 'modal',
              'data-bs-target': '#modals-slide-in'
            },
            init: function (api, node, config) {
              $(node).removeClass('btn-secondary');
            }
          }
        ],
        // For responsive popup
        responsive: {
          details: {
            // display: $.fn.dataTable.Responsive.display.modal({
            //   header: function (row) {
            //     var data = row.data();
            //     return 'Details of ' + data['fullName'];
            //   }
            // }),
            type: 'column',
            renderer: function (api, rowIdx, columns) {
              var data = $.map(columns, function (col, i) {
                return col.columnIndex !== 6 // ? Do not show row in modal popup if title is blank (for check box)
                  ? '<tr data-dt-row="' +
                      col.rowIdx +
                      '" data-dt-column="' +
                      col.columnIndex +
                      '">' +
                      '<td>' +
                      col.title +
                      ':' +
                      '</td> ' +
                      '<td>' +
                      col.data +
                      '</td>' +
                      '</tr>'
                  : '';
              }).join('');
              return data ? $('<table class="table"/>').append('<tbody>' + data + '</tbody>') : false;
            }
          }
        },
        initComplete: function () {
            // Adding status filter once table initialized
            this.api()
            .columns(3)
            .every(function () {
                let column = this;
                $('#StatusDropdown').select2();
                $('#StatusDropdown').ready(function () {
                    let val = $.fn.dataTable.util.escapeRegex($('#StatusDropdown').val());
                    column.search(val ? val : '', false, false).draw();
                });
                $('#StatusDropdown').on('change', function () {
                    let val = $.fn.dataTable.util.escapeRegex($(this).val());
                    column.search(val ? val : '', false, false).draw();
                });
            });
        }
      });
    }

    $(document).on('click', '.edit-cms-modal', function() {
        let elemID = $(this).data('id').replace('edit-', ''),
            content = $(this).data('cmscontent'),
            title = $(this).data('cmstitle');
        
        content = convertBinaryToString(content);
        $('#exampleModalLabel').text("Update Account Type");
        $('#add-new-acc-types').attr('action', '/account-types/update');
        $('#title').val(title);
        $('#description').val(content).trigger('change');
        $('#id').val(elemID);
        $('#SubmitBtn').text("Update");
    });

    $(document).on('click', '.add-new', function() {
        $('#exampleModalLabel').text("Add Account Type");
        $('#add-new-acc-types').attr('action', '/account-types/store');
        $('#title').val('');
        $('#description').val('');
        $('#id').val('');
        $('#SubmitBtn').text("Create");
    });

    $(document).on('click', '.statusUpdate', function () {
        var elemID = $(this).data('id');
        swal.fire({
            title: 'Are you sure?',
            icon: 'warning',
            // input: 'select',
            showCancelButton: true,
            confirmButtonText: 'Yes, change it!',
            cancelButtonText: 'No, cancel!',
            reverseButtons: true
        }).then(function (result) {
            if (result.value) {
                window.location.href = `${window.location.protocol}//${window.location.host}/account-types/status-change/${elemID}`;
            }
        });
    });
    
    $(document).on('click', '.deleteType', function() {
        var elemID = $(this).attr('id').replace('del-', '');
        swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
            reverseButtons: true
        }).then(function(result) {
            if (result.value) {
                window.location.href = `${location.protocol}//${window.location.host}/account-types/delete/${elemID}`;
            }
        });
    });
});

// Convert Binary to String (Method)
function convertBinaryToString(str) {
  return str.split(" ").map(function(elem) {
    return String.fromCharCode(parseInt(elem, 2));
  }).join("")
}
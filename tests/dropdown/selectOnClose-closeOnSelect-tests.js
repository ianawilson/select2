module('Dropdown - selectOnClose & closeOnSelect interaction');

var $ = require('jquery');

var Utils = require('select2/utils');
var Options = require('select2/options');

var SelectData = require('select2/data/select');

var Results = require('select2/results');
var Dropdown = require('select2/dropdown');
var SelectOnClose = require('select2/dropdown/selectOnClose');
var CloseOnSelect = require('select2/dropdown/closeOnSelect');

var options = new Options({
  selectOnClose: true,
  closeOnSelect: true
});

test('avoid infinite loop when both selectOnClose and closeOnSelect',
  function (assert) {
    expect(3);

    // Decorate results scoped in here to avoid messing with other unit tests.
    var ModifiedResults = Utils.Decorate(Results, SelectOnClose);
    // CloseOnSelect decorates a Dropdown adapter.
    var ModifiedDropdown = Utils.Decorate(Dropdown, CloseOnSelect);

    var $element = $('<select></select>');
    var select = new ModifiedResults(
      $element,
      options,
      new SelectData($element)
    );
    var dropdown = new ModifiedDropdown(
      $element,
      options
    );

    // assert.ok(
    //   hasOwnProperty(select, '_handleSelectOnClose'),
    //   'Must have _handleSelectOnClose()'
    // );
    // assert.ok(
    //   hasOwnProperty(select, '_selectTriggered'),
    //   'Must have _selectTriggered()'
    // );
    // assert.ok(false, Object.keys(select));

    var $dropdown = select.render();

    var container = new MockContainer();
    var $container = $('<div></div>');
    dropdown.bind(container, $container);
    select.bind(container, $container);

    var selectedCount = 0, closedCount = 0;
    container.on('select', function () {
      selectedCount++;
    });
    container.on('close', function() {
      closedCount++;
    });

    select.append({
      results: [
        {
          id: '1',
          text: 'Test'
        }
      ]
    });

    assert.equal(
      $dropdown.find('li').length,
      1,
      'There should be one result in the dropdown'
    );

    $dropdown.find('li').addClass('select2-results__option--highlighted');

    container.trigger('close');

    assert.ok(
      selectedCount === 1,
      'The select event should have been triggered once -- triggered ' +
      selectedCount + ' times'
    );
    assert.ok(
      closedCount === 1,
      'The close event should have been triggered once -- triggered ' +
      closedCount + ' times'
    );
  }
);

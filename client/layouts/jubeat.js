
i2DX.layout('jubeat', function(ui) {

  function style(index) {
    return {
      width: '222px',
      height: '222px',
      bottom: (6 + 264 * (Math.floor((15-index) / 4))) + 'px',
      marginLeft: (index % 4) * 264 + 6 + 'px'
    };
  }

  ui.button('jubeat_1', style(0));
  ui.button('jubeat_2', style(1));
  ui.button('jubeat_3', style(2));
  ui.button('jubeat_4', style(3));
  ui.button('jubeat_5', style(4));
  ui.button('jubeat_6', style(5));
  ui.button('jubeat_7', style(6));
  ui.button('jubeat_8', style(7));
  ui.button('jubeat_9', style(8));
  ui.button('jubeat_10', style(9));
  ui.button('jubeat_11', style(10));
  ui.button('jubeat_12', style(11));
  ui.button('jubeat_13', style(12));
  ui.button('jubeat_14', style(13));
  ui.button('jubeat_15', style(14));
  ui.button('jubeat_16', style(15));

});

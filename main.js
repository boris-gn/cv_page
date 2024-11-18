$(document).ready(function () {
    var input = $('.field').find('input, textarea');
    input.keyup(function () {
      inputTest(this);
    });
  });
  
  function inputTest(that) {
    var field = $(that).closest('.field');
    var form = $(that).closest('form, .form');
    var length = $.trim($(that).val()).length;
  
    //  FILLED
    if (length > 0) field.addClass('filled');else field.removeClass('filled');
  
    //  VALIDATED
    if (length >= 4) {
      field.addClass('validated');
      form.addClass('validated');
    } else {
      field.removeClass('validated');
      form.removeClass('validated');
    }
  }
  var Timer = {
    length: null,
    time: null,
    selector: null,
    interval: null,
    callback: null,
  
    //  RUN
    run: function (selector, callback, length) {
      Timer.length = length;
      Timer.time = Timer.length;
      Timer.selector = selector;
      Timer.callback = callback;
      $(Timer.selector).text(Timer.length);
      Timer.interval = setInterval(Timer.count, 1000);
    },
  
    //  COUNT
    count: function () {
      Timer.time = Timer.time - 1;
      $(Timer.selector).text(Timer.time);
      if (Timer.time <= 0) {
        if (typeof Timer.callback === 'function' && Timer.callback) Timer.callback();
        Timer.reset();
      }
    },
  
    //  RESET
    reset: function () {
      clearInterval(Timer.interval);
      Timer.length = null;
      Timer.time = null;
      Timer.selector = null;
      Timer.interval = null;
      Timer.callback = null;
    }
  };
  var Identity = {
    duration: 1400,
    delay: 500,
    iteration: 0,
    processing: false,
    enough: false,
    interval: null,
    callback: null,
    status: 'loading',
    id: '#identity',
    selector: '#identity div',
    classes: 'working rest robot',
  
    //  WORK
    work: function () {
      if (Identity.status != 'loading') Identity.status = 'working';
      Identity.wait(function () {
        $(Identity.id).addClass('working');
      });
    },
  
    //  ROBOT
    robot: function () {
      Identity.status = 'robot';
      Identity.wait(function () {
        $(Identity.id).addClass('robot');
      });
    },
  
    //  REST
    rest: function () {
      Identity.abort();
      Identity.status = 'rest';
      setTimeout(function () {
        Identity.abort();
        $(Identity.id).addClass('rest');
      }, Identity.delay);
    },
  
    //  WAIT
    wait: function (call) {
      if (Identity.processing != true) {
        Identity.abort();
        Identity.processing = true;
  
        setTimeout(function () {
          if (typeof call === 'function' && call) call();
          Identity.waiting();
          Identity.interval = setInterval(Identity.waiting, Identity.duration);
        }, Identity.delay);
      }
    },
  
    //  WAITING
    waiting: function () {
      if (Identity.enough != true) {
        ++Identity.iteration;
        return;
      }
  
      Identity.stopping();
    },
  
    //  STOP
    stop: function (callback) {
      setTimeout(function () {
        if (Identity.processing == true) {
          Identity.enough = true;
          Identity.callback = callback;
  
          $(Identity.selector).attr('style', 'animation-iteration-count: ' + Identity.iteration + '; -webkit-animation-iteration-count: ' + Identity.iteration + ';');
        }
      }, Identity.delay);
    },
  
    //  STOPPING
    stopping: function () {
      clearInterval(Identity.interval);
      Identity.rest();
  
      if (typeof Identity.callback === 'function' && Identity.callback) Identity.callback();
      Identity.reset();
    },
  
    //  ABORT
    abort: function () {
      if (Identity.status == 'robot') $(Identity.id).removeClass('robot');else if (Identity.status != 'loading' && Identity.processing != true) $(Identity.id).removeClass(Identity.classes + ' loading');else $(Identity.id).removeClass(Identity.classes);
    },
  
    //  RESET
    reset: function () {
      Identity.iteration = 0;
      Identity.processing = false;
      Identity.enough = false;
      Identity.interval = null;
      Identity.callback = null;
  
      $(Identity.selector).removeAttr('style');
    }
  };
  var Stars = {
    canvas: null,
    context: null,
    circleArray: [],
    colorArray: ['#4c1a22', '#4c1a23', '#5d6268', '#1f2e37', '#474848', '#542619', '#ead8cf', '#4c241f', '#d6b9b1', '#964a47'],
  
    mouseDistance: 50,
    radius: .5,
    maxRadius: 1.5,
  
    //  MOUSE
    mouse: {
      x: undefined,
      y: undefined,
      down: false,
      move: false
    },
  
    //  INIT
    init: function () {
      this.canvas = document.getElementById('stars');
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.canvas.style.display = 'block';
      this.context = this.canvas.getContext('2d');
  
      window.addEventListener('mousemove', this.mouseMove);
      window.addEventListener('resize', this.resize);
  
      this.prepare();
      this.animate();
    },
  
    //  CIRCLE
    Circle: function (x, y, dx, dy, radius, fill) {
      this.x = x;
      this.y = y;
      this.dx = dx;
      this.dy = dy;
      this.radius = radius;
      this.minRadius = this.radius;
  
      this.draw = function () {
        Stars.context.beginPath();
        Stars.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        Stars.context.fillStyle = fill;
        Stars.context.fill();
      };
  
      this.update = function () {
        if (this.x + this.radius > Stars.canvas.width || this.x - this.radius < 0) this.dx = -this.dx;
        if (this.y + this.radius > Stars.canvas.height || this.y - this.radius < 0) this.dy = -this.dy;
  
        this.x += this.dx;
        this.y += this.dy;
  
        //  INTERACTIVITY
        if (Stars.mouse.x - this.x < Stars.mouseDistance && Stars.mouse.x - this.x > -Stars.mouseDistance && Stars.mouse.y - this.y < Stars.mouseDistance && Stars.mouse.y - this.y > -Stars.mouseDistance) {
          if (this.radius < Stars.maxRadius) this.radius += 1;
        } else if (this.radius > this.minRadius) {
          this.radius -= 1;
        }
  
        this.draw();
      };
    },
  
    //  PREPARE
    prepare: function () {
      this.circleArray = [];
  
      for (var i = 0; i < 1200; i++) {
        var radius = Stars.radius;
        var x = Math.random() * (this.canvas.width - radius * 2) + radius;
        var y = Math.random() * (this.canvas.height - radius * 2) + radius;
        var dx = (Math.random() - 0.5) * 1.5;
        var dy = (Math.random() - 1) * 1.5;
        var fill = this.colorArray[Math.floor(Math.random() * this.colorArray.length)];
  
        this.circleArray.push(new this.Circle(x, y, dx, dy, radius, fill));
      }
    },
  
    //  ANIMATE
    animate: function () {
      requestAnimationFrame(Stars.animate);
      Stars.context.clearRect(0, 0, Stars.canvas.width, Stars.canvas.height);
  
      for (var i = 0; i < Stars.circleArray.length; i++) {
        var circle = Stars.circleArray[i];
        circle.update();
      }
    },
  
    //  MOUSE MOVE
    mouseMove: function (event) {
      Stars.mouse.x = event.x;
      Stars.mouse.y = event.y;
    },
  
    //  RESIZE
    resize: function () {
      Stars.canvas.width = window.innerWidth;
      Stars.canvas.height = window.innerHeight;
    }
  };
  var renderer, scene, camera, ww, wh, particles;
  
  ww = window.innerWidth, wh = window.innerHeight;
  
  var centerVector = new THREE.Vector3(0, 0, 0);
  var previousTime = 0;
  speed = 10;
  isMouseDown = false;
  
  var getImageData = function (image) {
  
      var canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
  
      var ctx = canvas.getContext("2d");
      ctx.drawImage(image, 0, 0);
  
      return ctx.getImageData(0, 0, image.width, image.height);
  };
  
  function getPixel(imagedata, x, y) {
      var position = (x + imagedata.width * y) * 4,
          data = imagedata.data;
      return { r: data[position], g: data[position + 1], b: data[position + 2], a: data[position + 3] };
  }
  
  var drawTheMap = function () {
  
      var geometry = new THREE.Geometry();
      var material = new THREE.PointCloudMaterial();
      material.vertexColors = true;
      material.transparent = true;
      for (var y = 0, y2 = imagedata.height; y < y2; y += 1) {
          for (var x = 0, x2 = imagedata.width; x < x2; x += 1) {
              if (imagedata.data[x * 4 + y * 4 * imagedata.width] > 0) {
  
                  var vertex = new THREE.Vector3();
                  vertex.x = x - imagedata.width / 2 + (500 - 440 * .5);
                  vertex.y = -y + imagedata.height / 2;
                  vertex.z = -Math.random() * 500;
  
                  vertex.speed = Math.random() / speed + 0.015;
  
                  var pixelColor = getPixel(imagedata, x, y);
                  var color = "rgb(" + pixelColor.r + ", " + pixelColor.g + ", " + pixelColor.b + ")";
                  geometry.colors.push(new THREE.Color(color));
                  geometry.vertices.push(vertex);
              }
          }
      }
      particles = new THREE.Points(geometry, material);
  
      scene.add(particles);
  
      requestAnimationFrame(render);
  };
  
  var init = function () {
      renderer = new THREE.WebGLRenderer({
          canvas: document.getElementById("yahia"),
          antialias: true,
          alpha: true
      });
      renderer.setSize(ww, wh);
  
      scene = new THREE.Scene();
  
      camera = new THREE.OrthographicCamera(ww / -2, ww / 2, wh / 2, wh / -2, 1, 1000);
      camera.position.set(0, -20, 4);
      camera.lookAt(centerVector);
      scene.add(camera);
      camera.zoom = 1;
      camera.updateProjectionMatrix();
  
      imagedata = getImageData(image);
      drawTheMap();
  
      window.addEventListener('mousemove', onMousemove, false);
      window.addEventListener('mousedown', onMousedown, false);
      window.addEventListener('mouseup', onMouseup, false);
      window.addEventListener('resize', onResize, false);
  };
  var onResize = function () {
      ww = window.innerWidth;
      wh = window.innerHeight;
      renderer.setSize(ww, wh);
      camera.left = ww / -2;
      camera.right = ww / 2;
      camera.top = wh / 2;
      camera.bottom = wh / -2;
      camera.updateProjectionMatrix();
  };
  
  var onMouseup = function () {
      isMouseDown = false;
  };
  var onMousedown = function (e) {
      isMouseDown = true;
      lastMousePos = { x: e.clientX, y: e.clientY };
  };
  var onMousemove = function (e) {
      if (isMouseDown) {
          camera.position.x += (e.clientX - lastMousePos.x) / 100;
          camera.position.y -= (e.clientY - lastMousePos.y) / 100;
          camera.lookAt(centerVector);
          lastMousePos = { x: e.clientX, y: e.clientY };
      }
  };
  
  var render = function (a) {
  
      requestAnimationFrame(render);
  
      particles.geometry.verticesNeedUpdate = true;
      if (!isMouseDown) {
          camera.position.x += (0 - camera.position.x) * 0.06;
          camera.position.y += (0 - camera.position.y) * 0.06;
          camera.lookAt(centerVector);
      }
  
      renderer.render(scene, camera);
  };
  
  var imgData = ' data:image/jpeg;base64,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';
  
  var image = document.createElement("img");
  image.src = imgData;
  var Submit = {
  
    //  DATA
    data: function (template, fields) {
      var data = {};
      for (i = 0; i < fields.length; i++) {
        var field = $(fields[i]);
        var name = field.attr('name');
        var value = field.val().replace(/(?:\r\n|\r|\n)/g, '<br>');
        data[name] = value;
      }
  
      return data;
    },
  
    //  PUSH
    push: function (form) {
      var template = $('.template[data-template=' + form + ']');
      var fields = template.find('.field input, .field textarea');
  
      //  WAITING
      Submit.view('[data-status=waiting]', template);
  
      //  AJAX
      $.ajax({
        type: 'POST',
        url: 'includes/php/' + form + '.php',
        data: { dd: JSON.stringify(Submit.data(template, fields)) },
        dataType: 'json',
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          Submit.callback('error', form, template, fields);
        },
        success: function (data) {
          Submit.callback('success', form, template, fields);
        }
      });
    },
  
    //  CALLBACK
    callback: function (status, form, template, fields) {
      setTimeout(function () {
  
        //  SUCCESS
        if (status == 'success') {
          template.find('.form .status').removeClass('current');
          fields.closest('.field').fadeOut(700);
          fields.closest('.form').find('.submit').fadeOut(700);
          Identity.stop();
  
          if (form == 'secret') secretAvailability = false;else if (form == 'opinion') opinionAvailability = false;
  
          setTimeout(function () {
            fields.closest('.form').find('.submit').remove();
            fields.closest('.field').remove();
            template.find('.form .status[data-status=success]').addClass('current');
          }, 750);
        }
  
        //  ERROR
        else {
            Submit.view('[data-status=error]', template);
            setTimeout(function () {
              Submit.view(':not([data-status])', template);
            }, 6000);
          }
      }, 4000);
    },
  
    //	VIEW
    view: function (selector, template) {
      template.find('.form .status').removeClass('current');
      template.find('.form .status' + selector).addClass('current');
    },
  
    //	LISTEN
    listen: function (selector) {
      $(selector).on('click', function (e) {
        if ($(this).closest('.form').hasClass('validated')) {
          var form = $(this).attr('data-form');
          Submit.push(form);
        }
  
        e.preventDefault();
      });
    }
  };
  var Router = {
      wrapper: [],
      location: null,
  
      //	ROUTE
      route: function (location, callback) {
          Identity.work();
          Router.location = Router.processLocation(location);
  
          //	ROUTES
          Router.routes(callback);
      },
  
      //	PROCESS LOCATION
      processLocation: function (location) {
          if (location === undefined) location = window.location.hash;
  
          return location.replace('#', '');
      },
  
      //	CALLBACK
      callback: function (callback) {
          setTimeout(function () {
              Identity.stop();
        Router.updateWrapper();
        Router.updateTemplate(Router.wrapper[0]);
        window.location.hash = Router.location;
        Router.location = null;
  
        //  CALLBACKS
        Router.callbacks(Router.wrapper[0]);
        if (typeof callback === 'function' && callback) callback();
          }, 200);
      },
  
      //	UPDATE TEMPLATE
      updateTemplate: function (template) {
          var templates = $('.template');
          var current = $('.template[data-template=' + template + ']');
  
          templates.removeClass('current');
          setTimeout(function () {
              templates.hide();
              current.show().addClass('current');
          }, 1120);
      },
  
      //	UPDATE WRAPPER
      updateWrapper: function (push, pull) {
          if (push) Router.push(push);
          if (pull) Router.pull(pull);
  
          var wrapper = Router.wrapper.toString().replace(/,/g, ' ');
          $('.wrapper').attr('class', 'wrapper ' + wrapper);
      },
  
      //	PUSH
      push: function (items) {
          items = items.split(' ');
  
          for (i = 0; i < items.length; i++) {
              if (!Router.wrapper.includes(items[i]) && items[i] != '') Router.wrapper.push(items[i]);
          }
      },
  
      //	PULL
      pull: function (items) {
          items = items.split(' ');
  
          for (i = 0; i < items.length; i++) {
              if (Router.wrapper.includes(items[i]) && items[i] != '') Router.wrapper.splice(Router.wrapper.indexOf(items[i]), 1);
          }
      },
  
      //	LISTEN
      listen: function () {
          $('.wrapper').on('click', '.router', function (e) {
              Router.route($(this).attr('href'), window[$(this).attr('data-callback')]);
              e.preventDefault();
          });
  
          window.addEventListener('popstate', function (e) {
              Router.route(undefined);
          });
      }
  };
  Router.routes = function (callback) {
    Router.wrapper = [];
    var location = Router.location.split('/').filter(Boolean);
  
    //  HOME
    Router.push('home');
  
    //  CALLBACK
    Router.callback(callback);
  };
  Router.callbacks = function (wrapper) {
    if (wrapper == 'secret') secret();else if (wrapper == 'opinion') opinion();else if (wrapper == 'bucketAll') bucketAll();else if (wrapper == 'notFound') notFound();
  };
  var secretAvailability = true;
  function secret() {
    if (secretAvailability == true) {
      setTimeout(function () {
        var input = $('.template[data-template=secret] .field').find('input, textarea');
  
        input.focus();
        Identity.robot();
      }, Identity.duration * 1.25);
    }
  }
  var opinionAvailability = true;
  function opinion() {
    if (opinionAvailability == true) {
      setTimeout(function () {
        var input = $('.template[data-template=opinion] .field').find('input, textarea');
  
        input.focus();
        Identity.robot();
      }, Identity.duration * 1.25);
    }
  }
  function bucketAll() {
    var list = $('.template[data-template=bucketAll] .bucketList');
    var link = list.find('li.archived a');
  
    //  LISTEN
    link.hover(function () {
      list.addClass('hover');
    }, function () {
      list.removeClass('hover');
    });
  }
  function notFound() {
    setTimeout(function () {
      Timer.run('.template[data-template=notFound] time', function () {
        Router.route('#');
      }, 5);
    }, Identity.duration * 1.25);
  }
  
  function notFoundCallback() {
    Timer.reset();
  }
  var md = new MobileDetect(window.navigator.userAgent);
  
  $(document).ready(function () {
    Identity.work();
    $('.template main').mCustomScrollbar({
      theme: 'dark'
    });
  });
  
  function loadProject() {
    Router.route(undefined, function () {
  
      //  CALLBACK
      Router.listen();
      Submit.listen('.submit');
      if (!md.mobile()) {
        Stars.init();
        init();
      }
      setTimeout(function () {
        $('#signature').removeClass('loading');
      }, Identity.delay * 1.5);
    });
  };
  
  loadProject();
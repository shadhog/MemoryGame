$(window).load(function(){
	
  var rlMkw = 1;
	//var rlMkw = getUrlParameter('mkw'); // This need to be removed on live site. As well as the function.
	if(!rlMkw || rlMkw < 1 || rlMkw > 8) {
		$('body').html('<p class="wrong">This is Awkward, Something has gone wrong. It is possible that you have wrong parameters!</p>');
	}
	
	var prizes = [
		'Prize 1', // Prize 1
		'Prize 2', // Prize 2
		'Prize 3', // Prize 3
		'Prize 4', // Prize 4
		'Prize 5', // Prize 5
		'Prize 6', // Prize 6
		'Prize 7', // Prize 7
		'Prize 8'  // Prize 8
	];
	
	var winPrize = prizes[rlMkw-1];
	console.log('winPrize: ' + winPrize);
	
	
	var gameImages = [
		'1', 
		'1', 
		'2', 
		'2', 
		'3', 
		'3', 
		'4', 
		'4',
		'5', 
		'5', 
		'6', 
		'6'    
	];
	
	gameImages = shuffle(gameImages);
	console.log('gameImages: ' + gameImages);

	prizes = shuffle(prizes);
	
	var game = $('#game');  // Game Board
	var templateOne = '<div class="flipper" ';
	var templateTwo = '>\
							<div class="front"></div>\
							<div class="back">\
								<div class="prize"></div>\
							</div>\
						</div>';
	var numberOfCards = 12;
	var StopShaking = false;
	var flipped = 0;
	var massage = $('#massage');
	var winMassage = '<h1>Memory Game</h1><b><p>Congartiolations! You won<br/><a href="#">Click here to claim prize</a></p>';
	
	// Initial game board - Create cards
	for(i = 0 ; i < numberOfCards ; i++ ) {  // Create card on board
		game.append(templateOne + 'data-card=' + i + templateTwo);
	}

	var flipper = $('.flipper');
	setTimeout(function() {
		shakeCards();
	}, 2500);
	
	// Game flow - what will happen when clicking on card
	game.on('click', '.flipper:not(.currect)', pickInCards);

	
	var first;
	var firstCard;
	var Score = 0;
	
	// What Happend when clicking cards
	function pickInCards()	{
		event.preventDefault();
		StopShaking = true;
		//clearTimeout(timer);
		var timer = setTimeout(function() { 
			StopShaking = false;
		}, 7000);
		var thisCard = gameImages[$(this).attr('data-card')];
		if(!flipped) {
			flipped = true;
			$(this).addClass('active').find('.prize').html(thisCard);
			first = thisCard;
			firstCard = $(this);
		}
		else {
			flipped = false;
			if(first == thisCard) {
				$(this).addClass('active currect').animate({opacity: '0'},3000).find('.prize').html(thisCard).css('text-decoration', 'none');
				firstCard.addClass('currect').css('text-decoration', 'none').animate({opacity: '0'},3000);
				Score++;
				console.log('Score: ' + Score);
			}
			else {
				$(this).addClass('active').find('.prize').html(thisCard);
				game.off('click');
				setTimeout(function(){
					flipCards(false);
					game.on('click', '.flipper:not(.currect)', pickInCards);
				},1000);
			}
		}
		if(numberOfCards/2 == Score) {
			StopShaking = true;
			massage.html(winMassage);
			setTimeout(function() { 
				InitializeConfetti();
				setTimeout(function() { 
					DeactivateConfetti();
				}, 1500);
			}, 800);
		}
	};

	
	function shakeCards() {
		if(!StopShaking) shakeCard();
		setTimeout(function() {
			$('.shake').removeClass('shake');
			shakeCards();
		}, 2500);	
	}
	
	function shakeCard() {
		var time1 = Math.floor(Math.random() * 1000);
		var time2 = Math.floor(Math.random() * 1000) + 500;
		flipper.eq(Math.floor(Math.random() * 9)).addClass('shake');
		setTimeout(function() {
			flipper.eq(Math.floor(Math.random() * 9)).addClass('shake');
		}, time1);	
		setTimeout(function() {
			flipper.eq(Math.floor(Math.random() * 9)).addClass('shake');
		}, time2);
	}
	
	// make cards hide/show
	function flipCards(active) {
		var cards = $('.flipper:not(.currect)');
		if(active) cards.addClass('active');
		else if(active==false) cards.removeClass('active');
		else cards.toggleClass('active');
	}	
	
	// make cards hide/show
	function flipCardsAnimation(cards, active) {
		var time = 0;
		cards.each(function(i, el) {	
			setTimeout( function() {
				if(active) $(el).addClass('active');
				else if(active==false) $(el).removeClass('active');
				else $(el).toggleClass('active');
			}, time);
			time += 80;
		});
	}	
	
	// Wait for player choise of card
	function listenToCards() {
		game.on('click', '.flipper:not(.main)', function() {
		});
	}
	
	// Handle the end of the game
	function gameOver() {
	}
	
	// Shuffle array variable
	function shuffle(array) {
		var currentIndex = array.length, temporaryValue, randomIndex;

		// While there remain elements to shuffle...
		while (0 !== currentIndex) {

		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
		}

		return array;
	}
	
	// no need this function on live site - get the url parameters
	function getUrlParameter(sParam) {
		var sPageURL = decodeURIComponent(window.location.search.substring(1)),
			sURLVariables = sPageURL.split('&'),
			sParameterName,
			i;

		for (i = 0; i < sURLVariables.length; i++) {
			sParameterName = sURLVariables[i].split('=');

			if (sParameterName[0] === sParam) {
				return sParameterName[1] === undefined ? true : sParameterName[1];
			}
		}
	};
	

	

	/*  This is the Confetti code  */

    // globals
    var canvas;
    var ctx;
    var W;
    var H;
    var mp = 150; //max particles
    var particles = [];
    var angle = 0;
    var tiltAngle = 0;
    var confettiActive = true;
    var animationComplete = true;
    var deactivationTimerHandler;
    var reactivationTimerHandler;
    var animationHandler;

    // objects

    var particleColors = {
        colorOptions: ["DodgerBlue", "OliveDrab", "Gold", "pink", "SlateBlue", "lightblue", "Violet", "PaleGreen", "SteelBlue", "SandyBrown", "Chocolate", "Crimson"],
        colorIndex: 0,
        colorIncrementer: 0,
        colorThreshold: 10,
        getColor: function () {
            if (this.colorIncrementer >= 10) {
                this.colorIncrementer = 0;
                this.colorIndex++;
                if (this.colorIndex >= this.colorOptions.length) {
                    this.colorIndex = 0;
                }
            }
            this.colorIncrementer++;
            return this.colorOptions[this.colorIndex];
        }
    }

    function confettiParticle(color) {
        this.x = Math.random() * W; // x-coordinate
        this.y = (Math.random() * H) - H; //y-coordinate
        this.r = RandomFromTo(10, 30); //radius;
        this.d = (Math.random() * mp) + 10; //density;
        this.color = color;
        this.tilt = Math.floor(Math.random() * 10) - 10;
        this.tiltAngleIncremental = (Math.random() * 0.07) + .05;
        this.tiltAngle = 0;

        this.draw = function () {
            ctx.beginPath();
            ctx.lineWidth = this.r / 2;
            ctx.strokeStyle = this.color;
            ctx.moveTo(this.x + this.tilt + (this.r / 4), this.y);
            ctx.lineTo(this.x + this.tilt, this.y + this.tilt + (this.r / 4));
            return ctx.stroke();
        }
    }

    $(document).ready(function () {
        SetGlobals();
        //InitializeButton();
        //InitializeConfetti();

        $(window).resize(function () {
            W = window.innerWidth;
            H = window.innerHeight;
            canvas.width = W;
            canvas.height = H;
        });

    });

    /*function InitializeButton() {
        $('#stopButton').click(DeactivateConfetti);
        $('#startButton').click(RestartConfetti);
    }*/

    function SetGlobals() {
        canvas = document.getElementById("canvas");
        ctx = canvas.getContext("2d");
        W = window.innerWidth;
        H = window.innerHeight;
        canvas.width = W;
        canvas.height = H;
    }

    function InitializeConfetti() {
        particles = [];
        animationComplete = false;
        for (var i = 0; i < mp; i++) {
            var particleColor = particleColors.getColor();
            particles.push(new confettiParticle(particleColor));
        }
        StartConfetti();
    }

    function Draw() {
        ctx.clearRect(0, 0, W, H);
        var results = [];
        for (var i = 0; i < mp; i++) {
            (function (j) {
                results.push(particles[j].draw());
            })(i);
        }
        Update();

        return results;
    }

    function RandomFromTo(from, to) {
        return Math.floor(Math.random() * (to - from + 1) + from);
    }


    function Update() {
        var remainingFlakes = 0;
        var particle;
        angle += 0.01;
        tiltAngle += 0.1;

        for (var i = 0; i < mp; i++) {
            particle = particles[i];
            if (animationComplete) return;

            if (!confettiActive && particle.y < -15) {
                particle.y = H + 100;
                continue;
            }

            stepParticle(particle, i);

            if (particle.y <= H) {
                remainingFlakes++;
            }
            CheckForReposition(particle, i);
        }

        if (remainingFlakes === 0) {
            StopConfetti();
        }
    }

    function CheckForReposition(particle, index) {
        if ((particle.x > W + 20 || particle.x < -20 || particle.y > H) && confettiActive) {
            if (index % 5 > 0 || index % 2 == 0) //66.67% of the flakes
            {
                repositionParticle(particle, Math.random() * W, -10, Math.floor(Math.random() * 10) - 20);
            } else {
                if (Math.sin(angle) > 0) {
                    //Enter from the left
                    repositionParticle(particle, -20, Math.random() * H, Math.floor(Math.random() * 10) - 20);
                } else {
                    //Enter from the right
                    repositionParticle(particle, W + 20, Math.random() * H, Math.floor(Math.random() * 10) - 20);
                }
            }
        }
    }
    function stepParticle(particle, particleIndex) {
        particle.tiltAngle += particle.tiltAngleIncremental;
        particle.y += (Math.cos(angle + particle.d) + 3 + particle.r / 2) / 2;
        particle.x += Math.sin(angle);
        particle.tilt = (Math.sin(particle.tiltAngle - (particleIndex / 3))) * 15;
    }

    function repositionParticle(particle, xCoordinate, yCoordinate, tilt) {
        particle.x = xCoordinate;
        particle.y = yCoordinate;
        particle.tilt = tilt;
    }

    function StartConfetti() {
        W = window.innerWidth;
        H = window.innerHeight;
        canvas.width = W;
        canvas.height = H;
        (function animloop() {
            if (animationComplete) return null;
            animationHandler = requestAnimFrame(animloop);
            return Draw();
        })();
    }

    function ClearTimers() {
        clearTimeout(reactivationTimerHandler);
        clearTimeout(animationHandler);
    }

    function DeactivateConfetti() {
        confettiActive = false;
        ClearTimers();
    }

    function StopConfetti() {
        animationComplete = true;
        if (ctx == undefined) return;
        ctx.clearRect(0, 0, W, H);
    }

    function RestartConfetti() {
        ClearTimers();
        StopConfetti();
        reactivationTimerHandler = setTimeout(function () {
            confettiActive = true;
            animationComplete = false;
            InitializeConfetti();
        }, 100);

    }

    window.requestAnimFrame = (function () {
        return window.requestAnimationFrame || 
        window.webkitRequestAnimationFrame || 
        window.mozRequestAnimationFrame || 
        window.oRequestAnimationFrame || 
        window.msRequestAnimationFrame || 
        function (callback) {
            return window.setTimeout(callback, 1000 / 60);
        };
    })();
});


//$("a").vibrate();
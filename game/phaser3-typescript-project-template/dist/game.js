var MyGame = (function () {
    'use strict';

    var global = window;

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var Pong = /** @class */ (function (_super) {
        __extends(Pong, _super);
        function Pong() {
            return _super.call(this, 'pong') || this;
        }
        Pong.prototype.preload = function () {
            this.load.image('black_dot', 'assets/black_dot.png');
            this.load.image('red_bar', 'assets/red_bar.png');
            this.load.image('blue_bar', 'assets/blue_bar.png');
        };
        Pong.prototype.create = function () {
            this.add.image(400, 300, 'black_dot');
            this.add.image(100, 300, 'red_bar');
            this.add.image(700, 300, 'blue_bar');
        };
        return Pong;
    }(Phaser.Scene));
    var config = {
        type: Phaser.AUTO,
        parent: 'game_anchor',
        backgroundColor: '#125555',
        width: 800,
        height: 600,
        scene: Pong
    };
    new Phaser.Game(config);

    return Pong;

})();
//# sourceMappingURL=game.js.map

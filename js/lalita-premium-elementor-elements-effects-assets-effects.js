!(function (t, i) {
    "use strict";
    var e = {
        init: function () {
            i.hooks.addAction("frontend/element_ready/widget", e.elementorWidget);
        },
        elementorWidget: function (t) {
            new wpkoiWidgetParallax(t).init(), new wpkoiWidgetSatellite(t).init();
        },
    };
    t(window).on("elementor/frontend/init", e.init);
    var o = function (i) {
        var e,
            o = {};
        return (
            !!window.elementor.hasOwnProperty("elements") &&
            !!(e = window.elementor.elements).models &&
            (t.each(e.models, function (e, n) {
                t.each(n.attributes.elements.models, function (e, n) {
                    t.each(n.attributes.elements.models, function (t, e) {
                        i == e.id && (o = e.attributes.settings.attributes);
                    });
                });
            }),
            {
                speed: o.wpkoi_tricks_widget_parallax_speed || { size: 50, unit: "%" },
                parallax: o.wpkoi_tricks_widget_parallax || "false",
                invert: o.wpkoi_tricks_widget_parallax_invert || "false",
                stickyOn: o.wpkoi_tricks_widget_parallax_on || ["desktop", "tablet", "mobile"],
                satellite: o.wpkoi_tricks_widget_satellite || "false",
                satellitePosition: o.wpkoi_tricks_widget_satellite_position || "top-center"
            })
        );
    };
    (window.wpkoiWidgetParallax = function (e) {
        var n = this,
            a = t("> .elementor-widget-container", e),
            l = e.closest(".elementor-top-section"),
            s = e.data("id"),
            r = {},
            d = Boolean(i.isEditMode()),
            p = t(window),
            w = (navigator.userAgent.match(/Version\/[\d\.]+.*Safari/), "MacIntel" == navigator.platform ? " is-mac" : "");
        (n.init = function () {
            return (
                e.addClass(w),
                !!(r = d ? o(s) : e.data("wpkoi-tricks-settings")) &&
                    void 0 !== r &&
                    "false" !== r.parallax &&
                    void 0 !== r.parallax &&
                    void p.on("scroll.wpkoiWidgetParallax resize.wpkoiWidgetParallax", n.scrollHandler).trigger("resize.wpkoiWidgetParallax")
            );
        }),
            (n.scrollHandler = function (t) {
                var i = 0.01 * +r.speed.size,
                    o = "true" == r.invert ? -1 : 1,
                    n = p.height(),
                    s = p.scrollTop(),
                    d = e.offset().top,
                    w = (e.outerHeight(), l.outerHeight(), s - d + n / 2),
                    c = (w > 0 ? 1 : -1) * Math.pow(Math.abs(w), 0.85),
                    _ = r.stickyOn || [],
                    k = elementorFrontend.getCurrentDeviceMode();
                (c = o * Math.ceil(i * c)), -1 !== _.indexOf(k) ? a.css({ transform: "translateY(" + c + "px)" }) : a.css({ transform: "translateY(0)" });
            });
    }),
        (window.wpkoiWidgetSatellite = function (e) {
            var n = e.data("id"),
                a = {},
                l = Boolean(i.isEditMode());
            this.init = function () {
                return (
                    !!(a = l ? o(n) : e.data("wpkoi-tricks-settings")) &&
                    void 0 !== a &&
                    "false" !== a.satellite &&
                    void 0 !== a.satellite &&
                    (e.addClass("wpkoi-satellite-widget"), void t(".wpkoi-tricks-satellite", e).addClass("wpkoi-tricks-satellite--" + a.satellitePosition))
                );
            };
        });
})(jQuery, window.elementorFrontend);

/*This file was exported by "Export WP Page to Static HTML" plugin which created by ReCorp (https://myrecorp.com) */
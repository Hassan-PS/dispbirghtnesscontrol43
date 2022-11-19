const St = imports.gi.St;
const Gio = imports.gi.Gio;
const Lang = imports.lang;
const GLib = imports.gi.GLib;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;

class Extension {
    constructor() {
        this._indicator = null;
    }
    
    enable() {
        log(`enabling ${Me.metadata.name}`);

        let indicatorName = `${Me.metadata.name} Indicator`;
        
        // Create a panel button
        ///usr/share/gnome-shell/extensions/dispbirghtnesscontrol
        this._indicator = new PanelMenu.Button(0.0, indicatorName, false);
        
        // Add an icon
        let icon = new St.Icon({
            gicon: new Gio.ThemedIcon({name: 'list-add-symbolic'}),
            style_class: 'system-status-icon'
        });
        this._indicator.add_child(icon);
        this._indicator.actor.connect('button_press_event', Lang.bind(this, function(){
            GLib.spawn_command_line_async('sudo ddcutil setvcp 10 + 25');
        }, false));

        // `Main.panel` is the actual panel you see at the top of the screen,
        // not a class constructor.
        Main.panel.addToStatusArea(indicatorName, this._indicator, 2);


        let indicatorName2 = `${Me.metadata.name} Indicator2`;
        
        // Create a panel button
        this._indicator2 = new PanelMenu.Button(0.0, indicatorName2, false);
        let icon2 = new St.Icon({
            gicon: new Gio.ThemedIcon({name: 'list-remove-symbolic'}),
            style_class: 'system-status-icon'
        });
        this._indicator2.add_child(icon2);
        this._indicator2.actor.connect('button_press_event', Lang.bind(this, function(){
            GLib.spawn_command_line_async('sudo ddcutil setvcp 10 - 25');
        }, false));

        Main.panel.addToStatusArea(indicatorName2, this._indicator2, 2);
    }

    disable() {
        log(`disabling ${Me.metadata.name}`);

        this._indicator.destroy();
        this._indicator = null;

        this._indicator2.destroy();
        this._indicator2 = null;

    }
}


function init() {
    log(`initializing ${Me.metadata.name}`);
    return new Extension();
}

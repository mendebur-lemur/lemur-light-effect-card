"""Constants for Lemur Light Effect Card."""

DOMAIN = "lemur_light_effects"
VERSION = "1.4.0"
STORAGE_KEY = DOMAIN
STORAGE_VERSION = 1
SIGNAL_UPDATE = f"{DOMAIN}_update"
URL_BASE = "/lemur_light_effects"
URL_ICONS = "/lemur_light_effects_icons"
CARD_FILE = "lemur-light-effect-card.js"
ICON_DIR = "lemur_light_effects_icons"
MAX_ICON_BYTES = 512 * 1024
PANEL_URL = "lemur-light"
PANEL_ELEMENT = "lemur-light-effects-panel"
MAX_SETTINGS_BYTES = 256 * 1024
MAX_TABS_BYTES = 1024 * 1024

# the earlier "Ultimate Light Effect Card"; its data is taken over once on first start
OLD_STORAGE_KEY = "ultimate_light_effects"
OLD_ICON_DIR = "ultimate_light_effects_icons"
OLD_URL_ICONS = "/ultimate_light_effects_icons"

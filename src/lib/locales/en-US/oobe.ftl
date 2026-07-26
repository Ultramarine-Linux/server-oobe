# Ultramarine Server OOBE English source catalog
brand-name = Ultramarine Server
setup-title = Setup
fixture-mode = Fixture mode
switch-to-dark = Switch to dark mode
switch-to-light = Switch to light mode

first-run = First run
get-server-ready = Get your server ready

step-welcome-label = Welcome
step-welcome-description = Welcome to Ultramarine Server

step-device-name-label = Device name
step-device-name-description = Name this server and set a hostname

step-administrator-label = Create a User
step-administrator-description = Create your local user

step-password-label = Password
step-password-description = Set the administrator password

step-internet-label = Internet
step-internet-description = Check network status

step-tweaks-label = Server defaults
step-tweaks-description = Choose optional server defaults

step-tetra-label = Tetra
step-tetra-description = Connect the host management agent

step-fyra-label = Dashboard
step-fyra-description = Choose how Dashboard will be hosted

step-complete-label = Complete
step-complete-description = Review setup and hand off to Dashboard

language-title = Choose your language
language-search-label = Search languages
language-search-placeholder = Search by language or locale
language-group-label = Languages
language-empty = No languages match your search.
language-english = English
language-english-native = English

welcome-title = Welcome to Ultramarine Server
welcome-ready-title = Ready for setup
welcome-ready-description = Let's configure your host, create a user, and set up Dashbord.

keyboard-title = Set your keyboard
keyboard-search-label = Search layouts
keyboard-search-placeholder = Search layouts
keyboard-layout-label = Layout
keyboard-variant-label = Variant
keyboard-variant-group-label = Keyboard variants
keyboard-default-variant = Default

prev = Back
next = Continue
finish = Finish

# Device name
# These messages intentionally remain concise because the field labels are visible beside the inputs.
device-name-title = Name your server
device-name-label = Device name
hostname-label = Hostname
hostname-error = Use lowercase letters, numbers, dots, and hyphens without empty labels.

# Administrator
administrator-title = Create your administrator
full-name-label = Full name
username-label = Username
username-error = Use a lowercase username beginning with a letter or underscore.

# Password
password-title = Set a password
password-label = Password
password-confirm-label = Confirm password
password-mismatch = Passwords do not match.
password-too-short = Use at least 8 characters.

# Internet
internet-title = Check your internet connection
network-ready-title = Network is ready
network-offline-title = No Internet connection
network-unchecked-title = Network status has not been checked
network-offline-description = You can continue setup offline and retry later.
network-unchecked-description = The local OOBE service will report interfaces and connectivity here.
check-connection = Check connection
checking-connection = Checking…
open-network-settings = Open network settings
network-status-online = Network is ready
network-status-offline = No Internet connection
network-status-unchecked = Network status has not been checked

# Server defaults
defaults-title = Choose server defaults
recommended-defaults = Recommended server defaults
recommended-defaults-description = Apply the standard Ultramarine Server configuration.
automatic-updates = Automatic updates
automatic-updates-description = Keep the host updated according to its configured policy.
show-advanced = Show advanced options
show-fewer = Show fewer options

# Tetra
tetra-title = Connect Tetra
tetra-not-installed = Tetra is not installed
tetra-installing = Installing Tetra
tetra-stopped = Tetra is installed but stopped
tetra-running = Tetra is running and unpaired
tetra-running-description = Host fingerprint and pairing status will appear after the local agent reports them.
tetra-not-running-description = Start the local agent to prepare this server for Fyra pairing.
install-start-tetra = Install and start Tetra
start-tetra = Start Tetra
installing = Installing…
tetra-ready = Local Tetra detected. No token or certificate needs to be copied into the browser.

# Hosting choice
hosting-title = Choose hosting
hosting-lead = How do you want to access and manage this server?
hosting-global-title = Global hosting (recommended)
hosting-global-description = Manage this server through the Fyra global dashboard. Requires a Cloudflare tunnel for remote access.
hosting-local-title = Local hosting
hosting-local-description = Run the Ultramarine Dashboard on this server at port 3972. No outbound connection required.
hosting-both-title = Both
hosting-both-description = Host the dashboard locally and connect to Fyra for global management.
hosting-fyra-prompt-title = Connect your Fyra account
hosting-fyra-prompt-description = You will need to sign in with your Fyra credentials to authorize global management of this server. This link will be shown at the next step.

# Fyra
fyra-title = Connect to Fyra
fyra-not-started = Global connection is optional
fyra-pending = Waiting for authorization
fyra-authorized = Server authorized
fyra-pending-description = A real local service will open the Fyra device authorization handoff and report the result here.
fyra-authorized-description = The server can now establish its outbound authenticated connection.
fyra-not-started-description = Continue offline or begin a secure Fyra device authorization flow.
connect-fyra = Connect to Fyra
use-fixture-authorization = Use fixture authorization
continue-offline = Continue offline
review-setup = Review setup
go-to-dashboard = Go to Dashboard

# Completion
complete-title = Setup complete
complete-hostname = Hostname
complete-hostname-value = ultramarine-server
complete-administrator = Administrator
complete-administrator-value = Ready to configure
complete-tetra = Tetra
complete-tetra-value = Ready for local pairing
complete-dashboard = Dashboard
complete-dashboard-value = Offline or not paired
complete-hosting-global = Remote via Fyra (Cloudflare tunnel)
complete-hosting-local = Local dashboard (port 3972)
complete-hosting-both = Local dashboard + Fyra
local-recovery-title = Local recovery stays available
local-recovery-description = Keep this local setup path available for recovery even when the global Dashboard cannot be reached.
reboot = Reboot
shutdown = Shut down

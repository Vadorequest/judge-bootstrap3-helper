Judge Bootstrap 3 helper
============

Helper for Rails 3 `judge` gem.
https://github.com/joecorcoran/judge

# Summary

This script apply the client side validation to all forms once the DOM is loaded. Bind events in all inputs, apply bootstrap 3 classes and display icons (*success/error*), CSS class oriented. (font-awesome/bootstrap)

> *Based on the script from `adamjacobbecker` at https://github.com/joecorcoran/judge/issues/13*
 
## Dependencies

- **Font-Awesome**: [*Optional*] The script use `font-awesome` plugin (`fa fa-check`) that will add the `check` icon in the input when the validation succeeed or `. *If font-awesome is not installed, the icon won't appear*. (*close enough to glyphicon, but better :)*) https://github.com/FortAwesome/Font-Awesome/

## Screenshots
- **Success**: https://docs.google.com/file/d/0ByzbHcAxmCyvb2hTamlMaGFTMG8
- **Error**: https://docs.google.com/file/d/0ByzbHcAxmCyveTJMa1hvSzVfalU

# Installation
1. Import the file. Must be imported after judge. `<script scr="<%= assets_path('javascripts/helpers/judge.js')"></script>`

# Utilities

- **Validation**: Use Bootstrap 3 validation classes. Design based on BootstrapValidator. http://bootstrapvalidator.com/
- **Icon**: Use Font Awesome, CSS class oriented images. Could also use Glyphicon.
- **Validate by default**: Don't validate forms that have the html5 `data-novalidate=true`. (`form_for :user, html: { 'data-novalidate' => true }`), bind the validation otherwise.
- **Confirmation**: The confirmation verification (basically *passwords*) is updated when the main input **or** the confirmation input is updated.

# Customize

Of course, this helper could not fill entirely your needs, don't hesitate to customize it for your application. *If you think that youre changes are useful, please share/discuss/PR.*

# Contributing

You're welcome to make a **PR**, I will take a look at it as soon as possible. 

# Roadmap

1. Probably forgot some events to bind to the inputs.

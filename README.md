# Home-Assistant-Views-Walker
This small piece of script enables Home Assistant to load in a continuous loop a set of views

Copy views-walker-v2.js into /config/www of your Home Assistant Server

Add resource to configuration.yaml:

  resources:
  	- url: /local/views-walker-v2.js
      type: module

Add a new card fromwhere you want to jump to the next card. Best is add the card manualy:
  type: custom:views-walker
  nextpage: /lovelace/2
  timeinterval: 900
  entity: switch.dummy
  
Create in the next view the same card with another 'nextpage'. Beware that you don't point to the same page, then you create an loop.
ANd so on and so on... till yoy point back to the first page.

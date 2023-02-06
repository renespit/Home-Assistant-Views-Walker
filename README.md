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
  
The time interval is in seconds. Before you are content with your choises and done with your configurations, pick a timeinterval of at least 120 seconds. If you choose 1 second, you are allmost not able to fix this.

Create in the next view the same card with another 'nextpage'. Beware that you don't point to the same page, then you create an loop.
And so on and so on... till yoy point back to the first page.

# Overview

For the Rapyd hackathon we built Rapyd Split! It uses the Rapyd Checkout toolkit to let online store owners let their customers, including businesses, split the cost of large purchases easily without leaving the store’s website.

# The Problem

Splitting large purchases across a group of parties is something that’s been going for decades. 

**For Consumers**:
* Roommates splitting the cost of furniture
* Family members splitting the purchase of travel
* Friends pooling funds together to buy each other gifts

**For Businesses**:
* Sponsoring joint events
* Splitting cost of joint venture like equipment
* Splitting costs internally among departments


### But with so much split purchasing behavior, there is a lot of friction!
* Collecting payments after the fact is a pain. It involves sending payment requests through financial apps, wiring money to each other, and sometimes even writing a check!
* For businesses, it’s a complex of invoices and accounts payables
* And with all this, it happens AFTER the purchase has been made

# Our Solution: _Group Payments Made Easy_
For the hackathon we built RapydSplit to let people pitch in towards a purchase and only get charged when all the relevant parties have authorized their share.

And we built it with the Checkout Toolkit so it’s right in the store people are already using.

# How it works:

![Overview](https://i.imgur.com/aeIlVmM.png)
1) When the customer visit store’s website and click the Split Pay button, we’re displaying a React component that’s wrapping the Checkout Toolkit's iframe within it.

2) Once the customer chooses how many to split by, we create a checkout page with a unique splitPayID. So we’re authorizing the charge for this single customer but not capturing since we need all the customer to authorize their share of the purchase first. We’re also saving a uniquely generated splitPayId for this whole purchase and storing it in the metadata field of the payment object.

3) The app emails emails each person to authorize their share and they visit the website, the link includes that same splitPayId in the query parameters. 

4) That new customer comes to the site with their unique link.

5) Our app detects that ID in the URL, then restores the “state” of this group purchase by retrieving all the payments that have this same ID in their metadata to calculate how much has already been authorized.

6) The server receives webhooks for each purchase. Once the final person pays their share, the server takes the payment information from all the authorized payments and creates a group payment and this time, sets *capture* to true to finally capture the charges and finish the group purchase.

This way, no one is on the hook for paying until the entire group commits to pay their share, and Rapyd Split handles the rest.

# What's next?
There’s a lot more we want to do with Rapyd Pay, like:
* Allowing variable payment amounts among parties instead of even splits
* Incorporating pseudo-delayed capture for non-card payment methods like bank transfer authorizations
* And allowing people from different countries to pay with different currencies towards a group purchase, which isn’t possible with the group payments API yet.

We’re really excited to keep pushing the boundaries of embedded checkout and we want to give a huge shoutout to the Rapyd developers for helping in the hackathon Discord channel. Thanks! 🙏🏽

# Engineering Design: MVP for Henry

**Author:** [Kevin Anderson](kevin.m.anderson@icloud.com)

## Pre-review Checklist

Before scheduling your design review, ensure that you have checked all of the following boxes:

- [ ] Familiarize yourself with our EDR process
- [ ] Make sure PRD and EDD are aligned - Engineering Manager
- [ ] EDD has been reviewed by internal team members - Engineering Manager

## Resources

PRD: [Link](./productRequirements.md)

Supporting designs:

SQL database schema [Link](../prisma/schema.prisma)

## Glossary

<!--

List of terms, acronyms and/or abbreviations with their respective definitions that will be used across this EDD.

-->

## Overview

This doc is intended to design an MVP for front end based on the PRD given the time constraint imposed of 3 hours. It will also indicate what is excluded from the MVP and why.

## Goals

# Define the structure of the application

# Define the components needed for MVP

## Design Proposal

### Use Nextjs to define the structure of the application

- With a very limited time frame, using a framework like Nextjs allows us develop fast while also providing flexibility to change if necessary. Nextjs works well integrating routing, auth, and sql prisma databases.

### MVP components

- The Client views and functionality are the highest priority because without clients, then business cannot make money. The Provider UI functionality can be delayed by leveraging a Google Doc where the Providers can enter in their schedule in a spreadsheet. The app backend can then use Google Apps script to pull the data from this doc and then add to the database.

- Components
  Header - to include app name and login - make mobile friendly
  Layout - to include header in all pages and wrap content in Container
  TimeWindow - to show the start and end time in Client timezone, the reserve/confirm button , or confirmed status. User can click on the reserve button and this will create an appointment. The user can then click confirm button to confirm the appointment. After Confirmed, no buttons will appear, but a Confirmed with check mark will be shown. - make mobile Friendly
- Pages
  - Home page - Mobile Friendly
    - Appointments section - list of TimeWindows that are confirmed OR 'No Appointments Yet' text
    - allow Client to select a Provider from a menu
    - after Provider selected, show a list of available TimeWindows in chronological order - must use polling every minute to make sure list it up to date

### Exclusions - Future Iterations

- Header - add nav to support Provider/Client links, add mech to login to configure user as Client or Provider
- Pages - add Provider List Schedules, and Create Schedule. Update Client Schedule view to use a Calendar and Provider and/or time range search for availability.

## Platform Components

Out of Scope

## Data Design & Schema Changes

Out of Scope

## Metrics & Data Integration

Out of Scope

## Error Handling & Alerting
- Datadog synthetics should be created for successful login, and site availability every 5 minutes


## Safety

No unusual safety concerns.

## Security

No unique security concerns

## Audits and Logs

- Datadog should be added to project for error logging

## Scalability

No issues.  Project should be setup in AWS to dynamically scale horizontally

## Cost

No unusual costs.

## Experimentation

TODO

## Testing

- Test Plan will be created to include Cypress for end to end testing login. Integration and unit tests will cover the main flow and achieve 90% min coverage

## Training

Providers will need to be trained on using the Google Doc for entering their schedules

## Deployment

Normal process

## Lifecycle management

Nextjs is a large project and actively maintained. Engineering maintenance to keep its version current will be required.

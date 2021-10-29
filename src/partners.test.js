import findAvailabilityForPartners from "./index.js";
import data from "./data";

it("find partners data ", () => {
  expect(
    findAvailabilityForPartners(data.partners).toBe({
      countries: [
        {
          startDate: null,
          attendeeCount: 0,
          name: "United States",
          attendees: []
        },
        {
          startDate: "2017-04-29",
          attendeeCount: 1,
          name: "Ireland",
          attendees: ["cbrenna@hubspotpartners.com"]
        },
        {
          startDate: "2017-04-28",
          attendeeCount: 3,
          name: "Spain",
          attendees: [
            "tmozie@hubspotpartners.com",
            "taffelt@hubspotpartners.com",
            "omajica@hubspotpartners.com"
          ]
        }
      ]
    })
  );
});

import { db } from '../server/db';
import { blogPosts } from '../shared/schema';

const blogData = [
  {
    title: "A Hoppy Easter Surprise",
    slug: "a-hoppy-easter-surprise",
    content: `<p>Easter came early this year to Golden Pond, bringing with it a very special visitor who hopped right into the hearts of our residents and staff. The excitement was palpable as everyone gathered to welcome this delightful guest—none other than the Easter Bunny himself!</p><p><strong>A Visit Full of Cheer</strong></p><p>As our residents settled in the common area, adorned with spring decorations and vibrant flowers, the Easter Bunny made a grand entrance. Cheers and smiles lit up the room as he made his way around, handing out colorful Easter eggs and sharing warm, fluffy hugs. The atmosphere was filled with laughter and joy, making it a truly memorable morning for everyone involved.</p><p><strong>Creating Easter Memories</strong></p><p>The visit from the Easter Bunny wasn't just about the fun of the moment; it was a chance for our residents to engage in the festive spirit of Easter, reminisce about past holidays, and enjoy the company of friends and family members who joined in the celebration. Our staff snapped photos, ensuring that these happy memories would be captured for years to come.</p><p><strong>Looking Forward to More Celebrations</strong></p><p>Stay tuned to our blog for more <a href="/our-community/life-enrichment">festive events</a> as we continue to celebrate seasons and holidays at Golden Pond. Our community is always looking for ways to bring smiles and create joyful experiences for our residents.</p>`,
    summary: "Read about our festive celebrations, the fun activities, and the heartwarming community interactions that made this Easter truly special.",
    mainImage: "https://uploads-ssl.webflow.com/64b0cfee8f0d1851d628824d/66451ee22db8acc9fbdb5392_cover.webp",
    thumbnailImage: "https://uploads-ssl.webflow.com/64b0cfee8f0d1851d628824d/66451ee836c1ad5c65eff4f5_thumbnail.webp",
    featured: false,
    category: "Activities",
    author: "mariah-ruell",
    tags: ["general"],
    galleryImages: [
      "https://uploads-ssl.webflow.com/64b0cfee8f0d1851d628824d/66451d68a0983968624c414c_gallery1.webp",
      "https://uploads-ssl.webflow.com/64b0cfee8f0d1851d628824d/66451d6bbfccfa6d6d7d3554_gallery2.webp",
      "https://uploads-ssl.webflow.com/64b0cfee8f0d1851d628824d/66451eee1bff46172e04f86f_gallery4.webp"
    ],
    publishedAt: new Date("2024-03-29T00:00:00Z"),
    createdAt: new Date("2024-05-15T20:39:18Z"),
    updatedAt: new Date("2024-05-16T13:19:59Z")
  },
  {
    title: "An Enchanting Evening at the 2024 Memory Care Prom",
    slug: "an-enchanting-evening-at-the-2024-memory-care-prom",
    content: `<p>The night sparkled at Golden Pond as we celebrated our 2024 <a href="/living-options/memory-care">Memory Care</a> Prom, a wonderful event filled with laughter, dancing, and joy. This special evening was a vibrant showcase of the community spirit and warmth that characterize life at Golden Pond.</p><p><strong>Glamour and Glee in the Ballroom</strong></p><p>Our common area was transformed into a stunning ballroom, complete with elegant decorations and twinkling lights, setting the perfect scene for an unforgettable prom night. Residents dressed in their finest attire, adding a touch of glamour to the festive atmosphere. The room came alive with music as residents swayed and twirled to a mix of classic tunes and beloved hits.</p><p><strong>A Heartfelt Thanks</strong></p><p>As the prom came to a close, the sense of happiness and shared connection was palpable. This event wasn't just about dancing the night away; it was a celebration of the here and now, of being together and enjoying a wonderful evening in good company.</p><p><strong>Anticipation for Future Celebrations</strong></p><p>We are immensely thankful to everyone who joined in and helped make the 2024 Memory Care Prom a success. We eagerly look forward to next year's prom and more incredible moments together at Golden Pond.</p>`,
    summary: "Step into the enchanting 2024 Memory Care Prom at Golden Pond! Read about a night filled with dancing, joy, and community spirit.",
    mainImage: "https://uploads-ssl.webflow.com/64b0cfee8f0d1851d628824d/66452535f174fa0d39ae47d2_cover.webp",
    thumbnailImage: "https://uploads-ssl.webflow.com/64b0cfee8f0d1851d628824d/664525371008c7aa7b4234e7_thumbnail.webp",
    featured: false,
    category: "Activities",
    author: "marci-gerke",
    tags: ["memory-care"],
    galleryImages: [
      "https://uploads-ssl.webflow.com/64b0cfee8f0d1851d628824d/664525c6241d57bec6f78222_gallery1.webp",
      "https://uploads-ssl.webflow.com/64b0cfee8f0d1851d628824d/664526e87c5eb4a0080c1e40_gallery2.webp",
      "https://uploads-ssl.webflow.com/64b0cfee8f0d1851d628824d/664526ea79ca6081f0e8d0a8_gallery3.webp"
    ],
    publishedAt: new Date("2024-04-29T00:00:00Z"),
    createdAt: new Date("2024-05-15T21:19:45Z"),
    updatedAt: new Date("2024-05-15T21:19:45Z")
  },
  {
    title: "Celebrating 20 Years of Compassionate Care at Golden Pond Senior Living",
    slug: "celebrating-20-years-of-compassionate-care-at-golden-pond-senior-living",
    content: `<p>As we stand at a significant milestone, marking two decades of service and commitment to our residents at Golden Pond Senior Living, I am filled with a sense of pride and gratitude. Since our inception in 2004, our journey has been filled with countless memories, learning experiences, and an unwavering dedication to providing the best in senior care.</p><p><strong>Our Journey: </strong></p><p>In the past 20 years, Golden Pond has grown from a budding idea into a flourishing community that seniors proudly call home. Our commitment to quality care, personalized attention, and a vibrant living environment has been the cornerstone of our success.</p><p><strong>Key Achievements:</strong></p><ul><li>Developed a diverse range of services tailored to meet the unique needs of each resident and each stage of life from <a href="/living-options/independent-living">Independent Living</a> to <a href="/living-options/memory-care">Memory Care</a>.</li><li>Fostered a warm, inclusive community, ensuring that every resident feels valued and connected.</li><li>Received accolades and recognition for our exceptional care and community service.</li></ul><p><strong>Community Impact:</strong></p><p>Golden Pond has not only been a home for our residents but also a vital part of the Golden, Colorado community. We've partnered with local organizations, hosted public events, and contributed to the well-being of our town.</p><p><strong>Looking Ahead:</strong></p><p>As we step into the next decade, our commitment to excellence and innovation remains steadfast. We are excited to explore new opportunities to enhance <a href="/living-options">our services</a> and continue making a positive impact on the lives of our residents and the broader community.</p><p>Thank you to our dedicated staff, our wonderful residents, and the Golden community for being an integral part of our 20-year journey. Here's to celebrating our past and looking forward to a bright and fulfilling future!</p>`,
    summary: "20 years of care, community, and memories! Join us in celebrating two decades of Golden Pond Senior Living's commitment to excellence in senior care.",
    mainImage: "https://uploads-ssl.webflow.com/64b0cfee8f0d1851d628824d/65a82550e7663212d559770c_cover.webp",
    thumbnailImage: "https://uploads-ssl.webflow.com/64b0cfee8f0d1851d628824d/65a826b8cfddeb85c0f064b5_thumb.webp",
    featured: false,
    category: "Resource",
    author: "leigh-boney",
    tags: ["general"],
    galleryImages: [],
    publishedAt: new Date("2024-01-17T00:00:00Z"),
    createdAt: new Date("2024-01-17T19:15:23Z"),
    updatedAt: new Date("2024-01-17T19:20:14Z")
  },
  {
    title: "Celebrating Creativity and Mobility",
    slug: "celebrating-creativity-and-mobility",
    content: `<p>This fall, Golden Pond became a vibrant canvas of expression and a parade ground for positivity during our much-anticipated <a href="/living-options/memory-care">Memory Care</a> Art Show and Walker/Wheelchair Parade. The event highlighted the artistic talents and spirited mobility of our residents, making it a day to remember for the entire community.</p><p><strong>A Gallery of Expression</strong></p><p>Our Memory Care unit transformed into an art gallery, where the creative works of our residents were displayed with pride. Paintings, crafts, and sculptures adorned the space, each piece telling a unique story of imagination and persistence. Residents, staff, and visiting family members strolled through the gallery, admiring the array of artwork that showcased the diverse talents within our community.</p><p><strong>Parade of Pride and Joy</strong></p><p>Following the art showcase, the energy shifted when residents decked out their walkers and wheelchairs with colorful decorations—streamers, balloons, and Fall inspired fun. As they paraded through the courtyard, the air buzzed with music and cheers from onlookers. This parade was more than just a fun activity; it was a powerful display of independence and individuality, celebrating each resident's mobility in style.</p><p><strong>Empowerment on Wheels</strong></p><p>The parade provided an opportunity for our residents to redefine the meaning of their mobility aids. No longer just functional tools, their walkers and wheelchairs became vehicles of joy and expression. This shift not only boosted the spirits of the parade participants but also encouraged a broader conversation about mobility and capability in our community.</p><p><strong>Forward Together</strong></p><p>We are immensely proud of our residents and grateful to the staff and family members who contributed to the success of this event. The Memory Care Art Show and Parade at Golden Pond is just one of the many ways we strive to create a nurturing and vibrant environment for our residents.</p><p>Stay tuned to our <a href="/our-community/life-enrichment">activity calendar</a> for more enriching activities and special events that make Golden Pond a wonderful place to live.</p>`,
    summary: "Read about how our residents celebrated creativity and mobility, transforming challenges into a vibrant showcase of spirit and community.",
    mainImage: "https://uploads-ssl.webflow.com/64b0cfee8f0d1851d628824d/66451a34efdb172274105863_cover.webp",
    thumbnailImage: "https://uploads-ssl.webflow.com/64b0cfee8f0d1851d628824d/66451a34efdb172274105866_thumbnail.webp",
    featured: false,
    category: "Activities",
    author: "maria-torres",
    tags: ["general", "memory-care"],
    galleryImages: [
      "https://uploads-ssl.webflow.com/64b0cfee8f0d1851d628824d/66451a4481972ad4faaca264_gallery1.webp",
      "https://uploads-ssl.webflow.com/64b0cfee8f0d1851d628824d/66451a46af38c60ee6416732_gallery2.webp",
      "https://uploads-ssl.webflow.com/64b0cfee8f0d1851d628824d/664607f58fff80e8ac8fdb9b_gallery4.webp"
    ],
    publishedAt: new Date("2023-10-11T00:00:00Z"),
    createdAt: new Date("2024-05-15T20:28:34Z"),
    updatedAt: new Date("2024-05-16T13:20:05Z")
  },
  {
    title: "Crafting Community Connections: Golden Pond's Craft Fair Recap",
    slug: "crafting-community-connections-golden-ponds-craft-fair-recap",
    content: `<p>Hey there, craft enthusiasts! Leigh here, your Executive Director from Golden Pond. What an incredible day of creativity and fun we had at our Craft Fair on November 19th!</p><p>Our hallways buzzed with excitement as we opened our doors to the community from 9 AM to 4 PM. From hand-knit scarves to intricate wooden carvings, the variety of handcrafted treasures on display was truly impressive. It was heartwarming to see the passion, dedication, and talent within our community.</p><p>A big thank you goes out to Alisa and Sarah, who organized the event and made sure everything ran smoothly. They worked tirelessly to accommodate every participant and ensure everyone had a memorable experience.</p><p>The camaraderie and good cheer were palpable as participants exchanged crafting tips, admired each other's work, and even made a few sales. Who doesn't love taking home a unique, handmade piece of art?</p><p>If you missed out this time, don't worry! We love providing opportunities for our residents and community members to showcase their talents. So, stay tuned for our next crafting event!</p><p>Again, thank you to everyone who participated and visited the craft fair. It was your creativity and support that made the event a true success. Keep crafting, Golden Pond. I can't wait to see what you come up with next!</p><p>Leigh</p>`,
    summary: "Take a trip down memory lane and revisit the creative fervor and fun at Golden Pond's Craft Fair.",
    mainImage: "https://uploads-ssl.webflow.com/64b0cfee8f0d1851d628824d/6645297ab83e50fa89bde33e_cover.webp",
    thumbnailImage: "https://uploads-ssl.webflow.com/64b0cfee8f0d1851d628824d/6645297c1a72399924057d98_thumbnail.webp",
    featured: false,
    category: "Activities",
    author: "leigh-boney",
    tags: ["general"],
    galleryImages: [
      "https://uploads-ssl.webflow.com/64b0cfee8f0d1851d628824d/664525c6241d57bec6f78222_gallery1.webp",
      "https://uploads-ssl.webflow.com/64b0cfee8f0d1851d628824d/664526e87c5eb4a0080c1e40_gallery2.webp",
      "https://uploads-ssl.webflow.com/64b0cfee8f0d1851d628824d/664526ea79ca6081f0e8d0a8_gallery3.webp"
    ],
    publishedAt: new Date("2022-11-20T00:00:00Z"),
    createdAt: new Date("2023-07-20T02:43:34Z"),
    updatedAt: new Date("2024-05-15T21:30:39Z")
  },
  {
    title: "Chrome for a Cause: How Our Community Came Together to Support Alzheimer's Research",
    slug: "cruising-for-a-cause",
    content: `<p>Hello there, it's Leigh, your Executive Director from Golden Pond Retirement Community!</p><p>This past Saturday, July 8th, we combined classic cars, mouthwatering BBQ, and a good cause for an unforgettable day at our "Chrome for a Cause: Racing to Fight Alzheimer's" event. And let me tell you, it was nothing short of spectacular!</p><p>We couldn't have asked for a better day. The sun was shining, the BBQ was sizzling, and the energy was infectious. Our community turned out in full force, everyone excited to check out the amazing vintage cars and to lend their support to the Golden Butterflies, our team for the annual <a href="https://act.alz.org/site/SPageServer/?pagename=walk_homepage"><strong>Walk to End Alzheimer's</strong></a>.</p><p>Each ticket sold added more fuel to our cause, with all proceeds going directly to the <a href="https://www.alz.org/"><strong>Alzheimer's Association</strong></a>. Not only did our attendees relish juicy hamburgers and hot dogs fresh off the grill, but they also joined us in making a significant impact in the fight against Alzheimer's disease. Even our younger participants, who came for free, brought tons of smiles and laughter, adding to the joy of the day.</p><p>I was heartened to see the enthusiasm and generosity of everyone who came to join us. From the excitement of the games and the anticipation of the door prizes to the awe on everyone's faces as they admired the classic cars, the day was filled with memorable moments.</p><p>And you know what? We did it! Thanks to your overwhelming support and contributions, the <a href="https://act.alz.org/site/SPageServer/?pagename=walk_chapter&scid=1729">Golden Butterflies</a> have reached their fundraising goal! That means more resources for Alzheimer's research, more support for caregivers, and more help for families who are facing the challenges of this disease.</p><p>So, from the bottom of our hearts, we thank each and every one of you who attended and showed your support. Your participation made all the difference, and we couldn't have done it without you.</p><p>Stay tuned for more exciting events and initiatives. Together, we're not just a retirement community. We're a force racing towards a future without Alzheimer's.</p><p>'Til our next adventure,</p><p>Leigh</p>`,
    summary: "Take a ride down memory lane with our successful 'Chrome for a Cause' event that raised crucial funds for Alzheimer's research and support.",
    mainImage: "https://uploads-ssl.webflow.com/64b0cfee8f0d1851d628824d/66452893d7912ee4a34910ac_cover.webp",
    thumbnailImage: "https://uploads-ssl.webflow.com/64b0cfee8f0d1851d628824d/664528969d56468d261b807a_thumbnail.png",
    featured: false,
    category: "Activities",
    author: "leigh-boney",
    tags: ["general"],
    galleryImages: [
      "https://uploads-ssl.webflow.com/64b0cfee8f0d1851d628824d/64b89872eb9bada2e894a0be_1.webp",
      "https://uploads-ssl.webflow.com/64b0cfee8f0d1851d628824d/64b89875d7940a14bfcc8f8d_2.webp"
    ],
    publishedAt: new Date("2023-07-09T00:00:00Z"),
    createdAt: new Date("2023-06-07T04:23:10Z"),
    updatedAt: new Date("2024-05-15T21:26:54Z")
  },
  {
    title: "Golden Pond Prom Night: A Dance Down Memory Lane",
    slug: "golden-pond-prom-night-a-dance-down-memory-lane",
    content: `<p>Hello there, it's Leigh, your Executive Director at Golden Pond! I'm here to share an event that warmed our hearts and brought back beautiful memories—our 2023 Prom for our <a href="/living-options/memory-care">Meadows Memory Care residents</a>!</p><p>Who says proms are only for high school? We wanted to bring back the magic of this tradition, and oh, what a night it was! Our community was all dressed up, the dance floor was shining, and the music brought back golden memories.</p><p>Our residents looked absolutely stunning in their formal wear, their eyes gleaming with excitement. From corsages and boutonnieres to classic prom photos, we didn't miss a single detail.</p><p>The music from the past set the mood, making everyone tap their feet, sway to the rhythm, or take a trip down memory lane. We saw dance moves from every era, laughter filling the air, and a sense of togetherness that warmed our hearts.</p><p>Prom night was about more than just music and dance. It was a celebration of life, of shared memories, and of creating new ones. We proved that no matter our age, we can always relive and recreate those beautiful moments that make us smile.</p><p>If you couldn't join us, you missed a night filled with joy and nostalgia. But don't worry—we have many more delightful events planned that will make your heart dance.</p><p>Until next time, keep the music playing and your spirits high. After all, every day is a reason to celebrate at Golden Pond!</p>`,
    summary: "Take a step back in time and enjoy the unforgettable memories from Golden Pond's magical Prom Night for our Memory Care residents.",
    mainImage: "https://uploads-ssl.webflow.com/64b0cfee8f0d1851d628824d/66452b20be8aa1494575e101_cover.webp",
    thumbnailImage: "https://uploads-ssl.webflow.com/64b0cfee8f0d1851d628824d/66452b2679ca6081f0ec66ec_thumbnail.webp",
    featured: false,
    category: "Activities",
    author: "leigh-boney",
    tags: ["memory-care"],
    galleryImages: [
      "https://uploads-ssl.webflow.com/64b0cfee8f0d1851d628824d/64b8a05ad7940a14bfd55ded_1.webp",
      "https://uploads-ssl.webflow.com/64b0cfee8f0d1851d628824d/64b8a05e795433381d6b92bd_2.webp",
      "https://uploads-ssl.webflow.com/64b0cfee8f0d1851d628824d/64b8a06021d8a8af5b46e336_3.webp"
    ],
    publishedAt: new Date("2023-05-01T00:00:00Z"),
    createdAt: new Date("2023-07-20T02:49:27Z"),
    updatedAt: new Date("2024-05-15T21:38:10Z")
  },
  {
    title: "Join Us for a Day of Creativity and Compassion at the Summer Craft Show",
    slug: "join-us-for-a-day-of-creativity-and-compassion-at-the-summer-craft-show",
    content: `<p>Get ready for a heartwarming and creative day at the Golden Pond! We're excited to invite you to the Summer Craft Show, a special event filled with unique crafts and community spirit. </p><p>Join us on Saturday, June 14th, from 10 AM to 3 PM at 1270 N. Ford St., Golden, CO, for a day that promises more than just beautiful crafts.</p><p><strong>Creative Crafts and Meaningful Missions</strong></p><p>Discover a wide range of handcrafted goods from talented local artisans. Whether you're looking for something special to decorate your home or searching for a unique gift, you'll find something truly special at our craft show.</p><p><strong>Supporting a Great Cause</strong></p><p>Not only will you experience the joy of crafts, but you'll also be supporting an important cause. All proceeds from the event will go towards the <a href="https://act.alz.org/site/SPageServer/?pagename=walk_homepage"><strong>Walk to End Alzheimer's</strong></a>, helping to fund research and support services for those affected by this condition.</p><p><strong>Exciting Opportunities to Win</strong></p><p>Don't forget to participate in our door prize drawing! Tickets are available at the event—$1 for one or $6 for a bundle of five. Your participation increases your chances to win fabulous prizes and supports a great cause.</p><p><strong>Mark Your Calendar!</strong></p><p>Don't miss this opportunity to enjoy a day filled with creativity, community, and compassion. We look forward to seeing you there. Together, we can support our local artisans and make a difference in the fight against Alzheimer's.</p>`,
    summary: "Get ready for a heartwarming and creative day at the Golden Pond! We're excited to invite you to the Summer Craft Show, a special event filled with unique crafts and community spirit.",
    mainImage: "https://cdn.prod.website-files.com/64b0cfee8f0d1851d628824d/666b22aefd73d59f7af831f8_Post-GoldenPond-ezgif.com-png-to-webp-converter.webp",
    thumbnailImage: "https://cdn.prod.website-files.com/64b0cfee8f0d1851d628824d/666b22b7d1a568417b953b95_thumbnail-ezgif.com-png-to-webp-converter.webp",
    featured: false,
    category: "Activities",
    author: "leigh-boney",
    tags: ["general"],
    galleryImages: [
      "https://cdn.prod.website-files.com/64b0cfee8f0d1851d628824d/666b23f67048532a08f26792_walk.webp"
    ],
    publishedAt: new Date("2025-06-03T00:00:00Z"),
    createdAt: new Date("2024-06-13T16:48:05Z"),
    updatedAt: new Date("2025-06-12T17:11:48Z")
  },
  {
    title: "Local Beats and Eats: Our Day at Golden Visitor Center",
    slug: "local-beats-and-eats-our-day-at-golden-visitor-center",
    content: `<p>Hello Golden Pond Community, it's Leigh here, your Executive Director! We just wrapped up our wonderful Fall BBQ on the Creek event, and what an afternoon it was!</p><p>It all took place at the enchanting <a href="https://gogoldencolorado.org/event-space/#creekside">Golden Visitor Center.</a>, which, with the majestic <a href="https://www.5280.com/colorado-by-nature-north-and-south-table-mountains/">North and South Table Mountains</a> to the east, Lookout Mountain to the west, and the glistening Clear Creek nearby, provided the perfect backdrop for our autumn gathering. Our lovely group occupied the patio, where we took in the picturesque views while savoring good food and drinks, and grooving to the live entertainment.</p><p>This BBQ was all about celebrating the essence of community, and it was heartening to see so many familiar faces. The event was FREE for those aged 65 and above, and we had quite a turnout! It was a joy to catch up with all of you, sharing laughter, stories, and creating beautiful memories under the autumn sky.</p><p>It was truly a day to remember, and we couldn't have done it without your company. If you couldn't make it, fret not! There's always another opportunity around the corner to enjoy our close-knit community here at Golden Pond.</p><p>I'm looking forward to our next gathering! Until then, take care and keep smiling!</p><p>Best,</p><p>Leigh</p>`,
    summary: "Step into our recent trip to the Golden Visitor Center, where we enjoyed local cuisine, live music, and the rich history of Golden, Colorado",
    mainImage: "https://uploads-ssl.webflow.com/64b0cfee8f0d1851d628824d/66452a3e177425b262c1fcfb_cover.webp",
    thumbnailImage: "https://uploads-ssl.webflow.com/64b0cfee8f0d1851d628824d/66452a4006440a4b4a57e4b7_thumbnail.webp",
    featured: false,
    category: "Activities",
    author: "leigh-boney",
    tags: ["general"],
    galleryImages: [
      "https://uploads-ssl.webflow.com/64b0cfee8f0d1851d628824d/64b89d012fd64bfc7ce41dd2_1.webp"
    ],
    publishedAt: new Date("2022-10-10T00:00:00Z"),
    createdAt: new Date("2023-07-20T02:33:42Z"),
    updatedAt: new Date("2024-05-15T21:34:06Z")
  }
];

async function importBlogPosts() {
  console.log('Starting blog post import...');

  for (const post of blogData) {
    try {
      console.log(`Importing: ${post.title}`);

      await db.insert(blogPosts).values({
        title: post.title,
        slug: post.slug,
        content: post.content,
        summary: post.summary,
        mainImage: post.mainImage,
        thumbnailImage: post.thumbnailImage,
        featured: post.featured,
        category: post.category,
        author: post.author,
        tags: post.tags,
        galleryImages: post.galleryImages,
        publishedAt: post.publishedAt,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt
      }).onConflictDoUpdate({
        target: blogPosts.slug,
        set: {
          title: post.title,
          content: post.content,
          summary: post.summary,
          mainImage: post.mainImage,
          thumbnailImage: post.thumbnailImage,
          featured: post.featured,
          category: post.category,
          author: post.author,
          tags: post.tags,
          galleryImages: post.galleryImages,
          publishedAt: post.publishedAt,
          updatedAt: new Date()
        }
      });

      console.log(`✓ Successfully imported: ${post.title}`);
    } catch (error) {
      console.error(`✗ Failed to import "${post.title}":`, error);
    }
  }

  console.log('\nBlog post import completed!');
}

importBlogPosts().catch(console.error);
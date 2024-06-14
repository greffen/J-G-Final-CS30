# Major Project Reflection

## What advice would we give to our past selves if we were to start a project like this again?
- Read about Regex and fft before trying to implement them.
- Spend less time on the non-functional parts.
- Build a framework to work off of rather than trying to have everything work off of the bat.
- Make a more reasonable plan, and plan to have less time (was too ambitious)

## Was everything the game needs to have completed?
- Yes, we have a fully playable game and are satisfied with the results.

## Was the "needs to have" list completed? 
- Score indicators was the only point on our needs to have list that was omitted. We decided that it would both clutter the screen as well as be very challenging and not perticularly important to the gameplay experience.

## The hardest part?
- The SM file. It was undoubtedly the attempt made (and nearly finished) of converting the .SM files into notes that was the biggest challenge for us, and even if we did not fully close out that portion of the project; we got very close (an array of all notes was being generated, just not used) and overcame a lot of problems.
- The amount of bugs was also a big challenge, but not nearly as much as the SM file conversion.

## Were there any problems we could not solve?
- As mentioned above, one of the problems we could not solve was SM file loading. Originally we were halted by the format of the BPMS section, but learned and implemented a regex function to overcome this problem. A similar problem arose later on when we could not find a way to implement the change from gameNotes (which contained information like [0010, 1000, 0100, 0110] representing the empty and used lanes). We tried many things including rewriting the generateNotes, the parseSMFile and the convertNotesToGameNotes functions as well as the Bars class, but in the end abandoned our progress in favour of something that could be completed in the timeframe.

## What were we most proud of?
- Funnily enough despite not completing it, the SM file conversion is the part of the project we are most proud of. It was the most challenging, and was also probably the most "appicable skill learned". Adapting existing file formats is a skill that is useful, and I think if we were to do it again we will have learned enough to take it even farther. Even still it is the work we are most proud of, and hope that the effort put in shows regardless.

## Wow me factor/Extras for experts
- We figured out how to use the switch command to switch the cases between all 4 of the keys, as well as to switch what game screen was being shown.
- Another thing we figured out was regex. This was a bit of a pain, but we learned it from Bennett, who was even a bit confused. We used it to fix the BPMS and have it always be consistent even with other lines.
- We used fft to figure out the different pitches of the waveform of a song. We then used those different pitches to generate the seperate game notes.
- We used toFixed to make the percentage reader. It rounds the percentage to the nearest integer rather than having a bunch of decimal places and to make it look clean.
- Finally we figured out how to add new possibilities within p5.js itself. We found out how to add new expressions that were accepted by the p5.js editor so it wasnt throwing an error within the code.
<!--
  Stands in for an admissions FAQ page: a heading, a line of intro, then the
  questions as an accordion with headings one level below. Story-only.
-->
<script lang="ts">
  import Accordion from '../src/svelte/Accordion.svelte';
  import AccordionPanel from '../src/svelte/AccordionPanel.svelte';
  import type { AccordionAccent } from '../src/svelte/accordion.ts';

  let {
    single = false,
    buttons = false,
    compact = false,
    accent,
    open = false,
    title = 'Enrollment FAQ',
  }: {
    single?: boolean;
    buttons?: boolean;
    compact?: boolean;
    accent?: AccordionAccent;
    /** Every panel starts open. */
    open?: boolean;
    /** The section heading, also the accordion's `label`. */
    title?: string;
  } = $props();
</script>

<h2>{title}</h2>
<p>Answers to the questions prospective students ask most. Open a question to read its answer.</p>
<Accordion {single} {buttons} {compact} {accent} label={title}>
  <AccordionPanel heading="What are the admission requirements for enrolling in a degree program?" {open}>
    <p>To enroll in a degree program, you typically need to meet these requirements:</p>
    <ul>
      <li>A high school diploma or equivalent (e.g., GED)</li>
      <li>Completion of prerequisite courses, such as math and science for engineering</li>
      <li>Letters of recommendation and a personal statement</li>
      <li>A minimum GPA, which varies by program</li>
    </ul>
  </AccordionPanel>
  <AccordionPanel heading="How do I submit my application?" {open}>
    <p>Applications are submitted online through the <a href="#apply">admissions portal</a>.</p>
  </AccordionPanel>
  <AccordionPanel heading="When is the application deadline?" {open}>
    <p>Deadlines vary by program; check the <a href="#dates">dates for your program</a>.</p>
  </AccordionPanel>
  <AccordionPanel heading="Can I defer my admission?" {open}>
    <p>Admitted students may defer for up to one year by writing to the admissions office before May 1.</p>
  </AccordionPanel>
</Accordion>
<p>Still have questions? <a href="#contact">Contact the admissions office</a>.</p>

import type { SubTopicDetail } from '../types/content';
import type { SubTopicSummary } from '../types/taxonomy';

// Dynamically import all content JSON files
const contentModules = import.meta.glob<SubTopicDetail>('./content/*.json', { eager: true, import: 'default' });

const contentRegistry: Record<string, SubTopicDetail> = {};

for (const path in contentModules) {
  const content = contentModules[path];
  if (content && content.id) {
    contentRegistry[content.id.trim()] = content;
  }
}

export function hasCustomContent(id: string): boolean {
  return Boolean(contentRegistry[id?.trim()]);
}

export function getSubTopicDetail(subtopic: SubTopicSummary): SubTopicDetail {
  const normalizedId = subtopic.id.trim();
  if (contentRegistry[normalizedId]) {
    return contentRegistry[normalizedId];
  }

  // Generate dynamic structured placeholder for topics in queue
  return {
    id: subtopic.id,
    subject_id: subtopic.subject_id,
    unit_id: subtopic.unit_id,
    slug: subtopic.slug,
    title: subtopic.title,
    short_summary: {
      en: `High-yield exam notes and standard RPSC/RSSB MCQs for ${subtopic.title.en}.`,
      hi: `${subtopic.title.hi} हेतु प्रामाणिक परीक्षा उपयोगी नोट्स एवं बहुविकल्पीय प्रश्न।`
    },
    metadata: {
      pyq_frequency: subtopic.pyq_frequency,
      target_exams: subtopic.target_exams,
      last_updated: '2026-09-13',
      author_verified: false
    },
    notes_sections: [
      {
        section_title: {
          en: `Overview of ${subtopic.title.en}`,
          hi: `${subtopic.title.hi} — सामान्य परिचय`
        },
        content_markdown: {
          en: `This topic (${subtopic.title.en}) is part of the official RPSC and RSSB exam syllabus. Core conceptual notes and previous year questions are currently being compiled according to the v3 taxonomy standard.`,
          hi: `यह विषय (${subtopic.title.hi}) RPSC एवं RSSB के आधिकारिक पाठ्यक्रम का महत्वपूर्ण भाग है। इसके विस्तृत परीक्षा-उन्मुख नोट्स एवं पिछले वर्षों के प्रश्न तैयार किए जा रहे हैं।`
        }
      }
    ],
    key_facts_rapid_revision: [
      {
        en: `High-frequency topic for ${subtopic.target_exams.join(', ')} examinations.`,
        hi: `${subtopic.target_exams.join(', ')} परीक्षाओं हेतु अति-महत्वपूर्ण विषय।`
      }
    ],
    mcqs: [
      {
        id: `MCQ-${subtopic.id}-01`,
        question: {
          en: `Under which subject domain is the topic '${subtopic.title.en}' classified in the Rajasthan GK Syllabus?`,
          hi: `राजस्थान सामान्य ज्ञान पाठ्यक्रम में '${subtopic.title.hi}' किस विषय के अंतर्गत शामिल है?`
        },
        options: [
          { id: 'A', text: { en: subtopic.subject_id.toUpperCase(), hi: subtopic.subject_id.toUpperCase() } },
          { id: 'B', text: { en: 'General Science', hi: 'सामान्य विज्ञान' } },
          { id: 'C', text: { en: 'World Geography', hi: 'विश्व भूगोल' } },
          { id: 'D', text: { en: 'Indian Polity', hi: 'भारतीय राजव्यवस्था' } }
        ],
        correct_option: 'A',
        explanation: {
          en: `This sub-topic is classified under Unit ${subtopic.unit_id} of the master syllabus.`,
          hi: `यह उप-विषय मुख्य पाठ्यक्रम की इकाई ${subtopic.unit_id} का अंग है।`
        },
        difficulty: 'easy'
      }
    ]
  };
}

import os
import multiprocessing as mp
import io
import spacy
import pprint
from spacy.matcher import Matcher
import text_extractor


class ResumeExtractor(object):

    def __init__(
            self,
            resume,
            skills_file=None,
            custom_regex=None
    ):
        nlp = spacy.load('en_core_web_sm')
        custom_nlp = spacy.load('output/model-best')
        self.__skills_file = skills_file
        self.__custom_regex = custom_regex
        self.__matcher = Matcher(nlp.vocab)
        self.__details = {
            'name': None,
            'email': None,
            'skills': None,
            'degree': None,
            'designation': None,
            'experience': None,
            'no_of_pages': None,
            'total_experience': None,
        }
        self.__resume = resume
        if not isinstance(self.__resume, io.BytesIO):
            ext = os.path.splitext(self.__resume)[1].split('.')[1]
        else:
            ext = self.__resume.name.split('.')[1]
        self.__text_raw = text_extractor.extract_text(self.__resume, '.' + ext)
        self.__text = ' '.join(self.__text_raw.split())
        self.__nlp = nlp(self.__text)
        self.__custom_nlp = custom_nlp(self.__text_raw)
        self.__noun_chunks = list(self.__nlp.noun_chunks)
        self.__get_basic_details()

    def get_extracted_data(self):
        return self.__details

    def __get_basic_details(self):
        custom_entity = text_extractor.extract_entities_with_custom_model(
            self.__custom_nlp
        )
        name = text_extractor.extract_name(self.__nlp, matcher=self.__matcher)
        email = text_extractor.extract_email(self.__text)
        skills = text_extractor.extract_skills(
            self.__nlp,
            self.__noun_chunks,
            self.__skills_file
        )
        edu = text_extractor.extract_education(
            [sent.string.strip() for sent in self.__nlp.sents]
        )
        entities = text_extractor.extract_entity_sections_grad(self.__text_raw)

        try:
            self.__details['name'] = custom_entity['Name'][0]
        except (IndexError, KeyError):
            self.__details['name'] = name

        self.__details['email'] = email

        self.__details['skills'] = skills

        try:
            self.__details['degree'] = custom_entity['Degree']
        except KeyError:
            pass

        try:
            self.__details['designation'] = custom_entity['Designation']
        except KeyError:
            pass

        try:
            self.__details['experience'] = entities['experience']
            try:
                exp = round(
                    text_extractor.get_total_experience(entities['experience']) / 12,
                    2
                )
                self.__details['total_experience'] = exp
            except KeyError:
                self.__details['total_experience'] = 0
        except KeyError:
            self.__details['total_experience'] = 0
        self.__details['no_of_pages'] = text_extractor.get_number_of_pages(
            self.__resume
        )
        return


def resume_result_wrapper(resume):
    parser = ResumeExtractor(resume)
    return parser.get_extracted_data()


if __name__ == '__main__':
    pool = mp.Pool(mp.cpu_count())

    resumes = []
    data = []
    for root, directories, filenames in os.walk('resumes'):
        for filename in filenames:
            file = os.path.join(root, filename)
            resumes.append(file)

    results = [
        pool.apply_async(
            resume_result_wrapper,
            args=(x,)
        ) for x in resumes
    ]

    results = [p.get() for p in results]

    pprint.pprint(results)

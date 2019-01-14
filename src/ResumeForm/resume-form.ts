import * as Yup from "yup";
import { RouteComponentProps } from "react-router-dom";
import { FormikProps } from "formik";
import { WithFormikConfig } from "formik";

import {
  validationSchema as expSchema,
  defaultVal as experience
} from "../Experiences/experiences";

import {
  defaultVal as personalInfo,
  validationSchema as personalInfoSchema
} from "../PersonalInfo/personal-info";

import {
  validationSchema as edSchema,
  defaultVal as education
} from "../Education/education";

import { defaultValue as additionSkill } from "../AdditionalSkills/additional-skills";

import { defaultVal as lang } from "../Languages/languages";

import {
  defaultVal as skills,
  validationSchema as skillsSchema
} from "../Skills/skills";

import {
  EducationInput,
  CreateExperienceInput,
  CreateSkillInput,
  RatedInput,
  UpdateResumeInput,
  GetResume_getResume
} from "../graphql/apollo-gql";

import { HobbyVal, defaultVal as hobby } from "../Hobbies/hobbies";
import { validationSchema as ratedSchema } from "../Rated/rated";
import { UpdateResumeProps } from "../graphql/update-resume.mutation";
import { GetResumeProps } from "../graphql/get-resume.query";
import { stripTypeName } from "../utils";
import { SetFieldValue } from "../utils";

export interface OwnProps extends RouteComponentProps<{ title: string }> {}

export type Props = OwnProps &
  UpdateResumeProps &
  GetResumeProps &
  FormikProps<FormValues>;

export type FormValues = Partial<UpdateResumeInput>;

export const initialFormValues: FormValues = {
  personalInfo,
  experiences: [experience],
  education: [education],
  additionalSkills: [additionSkill],
  languages: [lang],
  hobbies: [hobby],
  skills
};

export const validationSchema = Yup.object<FormValues>().shape({
  personalInfo: personalInfoSchema,
  experiences: Yup.array<CreateExperienceInput>().of<CreateExperienceInput>(
    expSchema
  ),
  education: Yup.array<EducationInput>().of<EducationInput>(edSchema),
  skills: Yup.array<CreateSkillInput>().of<CreateSkillInput>(skillsSchema),
  additionalSkills: Yup.array<RatedInput>().of<RatedInput>(ratedSchema),
  languages: Yup.array<RatedInput>().of<RatedInput>(ratedSchema),
  hobbies: Yup.array<HobbyVal>()
});

// sections by string key
export enum Section {
  personalInfo = "personal-information",
  experiences = "experiences",
  education = "education",
  addSkills = "additional-skills",
  langs = "languages",
  hobbies = "hobbies",
  skills = "skill-summary",
  preview = "preview"
}

export const [sectionsList, sectionsLen]: [Section[], number] = (function() {
  const keys = Object.values(Section);

  return [keys, keys.length] as [Section[], number];
})();

export const toSection = (current: Section, to: "next" | "prev") => {
  const currentIndex = sectionsList.indexOf(current);
  let lift = 0;

  if (to === "next") {
    lift = 1;
  } else if (to === "prev") {
    lift = currentIndex > 0 ? -1 : 0;
  }

  return sectionsList[(currentIndex + lift) % sectionsLen];
};

export const lastSectionIndex = sectionsLen - 1;

export function getInitialValues(
  getResume: GetResume_getResume | undefined | null
) {
  const initial = { ...initialFormValues };

  if (!getResume) {
    return initial;
  }

  return Object.entries(getResume).reduce((acc, [k, v]) => {
    if (k === "__typename") {
      return acc;
    }

    if (!v) {
      acc[k] = initial[k];
      return acc;
    }

    acc[k] = stripTypeName(v);
    return acc;
  }, {});
}

export const formikConfig: WithFormikConfig<Props, FormValues> = {
  handleSubmit: () => null,

  mapPropsToValues: ({ getResume }) => {
    return getResume as FormValues;
  },

  enableReinitialize: true,

  validateOnChange: false,

  validateOnBlur: false
};

export interface ChildProps {
  setFieldValue: SetFieldValue<CreateExperienceInput>;
}

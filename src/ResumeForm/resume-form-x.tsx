import React from "react";
import { Form } from "semantic-ui-react";
import { Formik, FormikProps } from "formik";

import {
  FormValues,
  initialFormValues,
  validationSchema,
  Section,
  toSection,
  sectionsList,
  lastSectionIndex
} from "./resume-form";

import {
  PreviewBtn,
  PreviewBtnIcon,
  EditBtn,
  PrevBtnIcon,
  BottomNavs,
  NextBtn,
  NextBtnIcon,
  Container
} from "./resume-form-styles";

import { noOp } from "../utils";
import { ToolTip } from "../styles/mixins";
import Preview from "../Preview";
import { Mode as PreviewMode } from "../Preview/preview";
import PersonalInfo from "../PersonalInfo";
import Experiences from "../Experiences";
import Education from "../Education";
import AdditionalSkills from "../AdditionalSkills";
import Languages from "../Languages";
import Hobbies from "../Hobbies";
import Skills from "../Skills";
import { FORM_VALUES_KEY } from "../constants";

enum Action {
  editing = "editing",
  previewing = "previewing"
}

interface State {
  action: Action;
  section: Section;
}

interface Props {
  initialValues?: FormValues;
}

export class ResumeForm extends React.Component<Props, State> {
  state: State = {
    action: Action.editing,
    section: Section.personalInfo
  };

  values: FormValues = this.props.initialValues || initialFormValues;

  getValues = () => this.values;

  setValues = async (values: FormValues) => {
    localStorage.setItem(FORM_VALUES_KEY, JSON.stringify(values));
    this.values = values;
  };

  render() {
    return (
      <Container>
        <Formik
          initialValues={this.props.initialValues || initialFormValues}
          onSubmit={noOp}
          render={this.renderForm}
          validationSchema={validationSchema}
          validateOnChange={false}
        />
      </Container>
    );
  }

  private renderForm = ({ values, ...props }: FormikProps<FormValues>) => {
    this.setValues(values);
    const { action, section } = this.state;
    const sectionIndex = sectionsList.indexOf(section);

    return (
      <Form>
        {this.renderCurrEditingSection(values)}

        {action === Action.previewing && (
          <Preview values={values} mode={PreviewMode.preview} />
        )}
        <BottomNavs>
          {action === Action.editing && (
            <>
              {this.renderPreviewPartialBtn(sectionIndex)}

              {sectionIndex > 0 && (
                <EditBtn
                  onClick={() =>
                    this.setState({ section: toSection(section, "prev") })
                  }
                >
                  <ToolTip>
                    {`Previous resume section ${toSection(
                      section,
                      "prev"
                    ).toLowerCase()}`}
                  </ToolTip>

                  <PrevBtnIcon />

                  <span>Previous</span>
                </EditBtn>
              )}

              {sectionIndex < lastSectionIndex && (
                <NextBtn
                  onClick={() =>
                    this.setState({ section: toSection(section, "next") })
                  }
                >
                  <ToolTip>
                    {`Next resume section ${toSection(
                      section,
                      "next"
                    ).toLowerCase()}`}
                  </ToolTip>

                  <span>Next</span>

                  <NextBtnIcon />
                </NextBtn>
              )}

              {this.renderPreviewFinalBtn(sectionIndex)}
            </>
          )}

          {action === Action.previewing && (
            <EditBtn onClick={() => this.setState({ action: Action.editing })}>
              <ToolTip>Show resume editor</ToolTip>

              <PrevBtnIcon />

              <span>Back to Editor</span>
            </EditBtn>
          )}
        </BottomNavs>
      </Form>
    );
  };
  private renderPreviewFinalBtn = (sectionIndex: number) => {
    if (sectionIndex === lastSectionIndex) {
      return (
        <NextBtn
          onClick={() => {
            this.setState({ action: Action.previewing });
          }}
        >
          <ToolTip>End: preview your resume</ToolTip>

          <span>Preview Your resume</span>

          <NextBtnIcon />
        </NextBtn>
      );
    }

    return null;
  };

  private renderCurrEditingSection = (values: FormValues) => {
    const { action, section } = this.state;

    if (action !== Action.editing) {
      return null;
    }

    if (section === Section.personalInfo) {
      return <PersonalInfo values={values.personalInfo} label={section} />;
    }

    if (section === Section.experiences) {
      return <Experiences values={values.experiences} label={section} />;
    }

    if (section === Section.education) {
      return <Education label={section} values={values.education} />;
    }

    if (section === Section.addSkills) {
      return (
        <AdditionalSkills
          label={section}
          values={values.additionalSkills || []}
        />
      );
    }

    if (section === Section.langs) {
      return <Languages label={section} values={values.languages} />;
    }

    if (section === Section.hobbies) {
      return <Hobbies label={section} values={values.hobbies} />;
    }

    if (section === Section.skills) {
      return <Skills label={section} values={values.skills} />;
    }

    return null;
  };

  private renderPreviewPartialBtn = (sectionIndex: number) => {
    if (sectionIndex !== lastSectionIndex) {
      return (
        <PreviewBtn
          onClick={() => {
            this.setState({ action: Action.previewing });
          }}
        >
          <ToolTip>Partial: preview your resume</ToolTip>

          <PreviewBtnIcon />

          <span>Preview</span>
        </PreviewBtn>
      );
    }

    return null;
  };
}

export default ResumeForm;

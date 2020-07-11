import React from 'react';
import { useForm } from 'react-hook-form';
import { ArrowLeftOutlined, FireOutlined } from '@ant-design/icons';

import {
  periodsForForm,
  periodsFromForm,
  depositsForForm,
  depositsFromForm,
} from '../../util/helpers';
import { currencyOptions } from '../../content/summon-presets';

import './Summon.scss';

const SummonStepThree = ({
  daoData,
  setDaoData,
  setCurrentStep,
  handleSummon,
}) => {
  const {
    register,
    getValues,
    watch,
    handleSubmit,
    errors,
    formState,
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      ...daoData,
      formattedPeriods: periodsForForm(daoData),
      formattedDeposits: depositsForForm(daoData),
    },
  });

  const { isDirty, isValid, isSubmitted } = formState;

  const watchPeriodFields = watch([
    'formattedPeriods.votingPeriod',
    'formattedPeriods.gracePeriod',
  ]);

  const watchDepositFields = watch([
    'formattedDeposits.proposalDeposit',
    'formattedDeposits.processingReward',
  ]);

  const onSubmit = data => {
    handleSummon(data);
  };

  const navigate = step => {
    setDaoData(prevState => {
      return {
        ...prevState,
        ...getValues(),
        ...periodsFromForm(watchPeriodFields, daoData.periodDuration),
        ...depositsFromForm(watchDepositFields),
      };
    });

    if (step === 'summon') {
      alert('coming soon');
    } else {
      setCurrentStep(step);
    }
  };

  const handleCurrencyChange = event => {
    const selectedOption = currencyOptions.find(option => {
      return event.target.value === option.value;
    });

    setDaoData(prevState => {
      return {
        ...prevState,
        currency: selectedOption.value,
        approvedToken: selectedOption.address,
      };
    });
  };

  return (
    <div className="SummonStepThree">
      <form
        className="Form NoCode"
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
      >
        <div>
          <h4>Name</h4>
          <p>
            Our DAO is called{' '}
            <input
              className="inline-field"
              name="name"
              ref={register({
                required: true,
              })}
            />
            {errors.name?.type === 'required' && (
              <span className="required-field">daos need names</span>
            )}
          </p>
        </div>

        <div>
          <h4>Description</h4>
          <p>
            The quick description is{' '}
            <textarea
              className="inline-field"
              name="description"
              ref={register({
                required: true,
              })}
            />
            {errors.description?.type === 'required' && (
              <span className="required-field">daos need descriptions</span>
            )}
          </p>
        </div>

        <div>
          <h4>Currency</h4>
          <div>
            Our primary currency is{' '}
            <select
              value={daoData.currency}
              onChange={handleCurrencyChange}
              className="inline-field"
            >
              {currencyOptions.map(option => {
                return (
                  <option value={option.value} key={option.value}>
                    {option.label}
                  </option>
                );
              })}
            </select>
            and it'll cost at least
            <input
              className="inline-field"
              name="minimumTribute"
              ref={register({
                required: true,
                pattern: /^-?\d*\.?\d*$/,
              })}
            />
            {errors.minimumTribute?.type === 'required' && (
              <span className="required-field">required</span>
            )}
            {daoData.currency} to join.
          </div>
        </div>

        <div>
          <h4>Voting</h4>
          <p>
            Our voting period lasts{' '}
            <input
              className="inline-field"
              name="formattedPeriods.votingPeriod"
              ref={register({
                required: true,
                pattern: /^-?\d*\.?\d*$/,
              })}
            />{' '}
            {errors.formattedPeriods?.votingPeriod?.type === 'required' && (
              <span className="required-field">required</span>
            )}
            {errors.formattedPeriods?.votingPeriod?.type === 'pattern' && (
              <span className="required-field">not a number</span>
            )}
            days. and the grace period is another{' '}
            <input
              className="inline-field"
              name="formattedPeriods.gracePeriod"
              ref={register({
                required: true,
                pattern: /^-?\d*\.?\d*$/,
              })}
            />{' '}
            {errors.formattedPeriods?.gracePeriod?.type === 'required' && (
              <span className="required-field">required</span>
            )}
            {errors.formattedPeriods?.gracePeriod?.type === 'pattern' && (
              <span className="required-field">not a number</span>
            )}
            days.
          </p>
        </div>

        <div>
          <h4>Deposits</h4>
          <p>
            And a proposal deposit costs{' '}
            <input
              className="inline-field"
              name="formattedDeposits.proposalDeposit"
              ref={register({
                required: true,
                pattern: /^-?\d*\.?\d*$/,
              })}
            />
            {errors.formattedDeposits?.proposalDeposit?.type === 'required' && (
              <span className="required-field">required</span>
            )}
            {errors.formattedDeposits?.proposalDeposit?.type === 'pattern' && (
              <span className="required-field">not a number</span>
            )}{' '}
            {daoData.currency} and the proposal reward is{' '}
            <input
              className="inline-field"
              name="formattedDeposits.processingReward"
              ref={register({
                required: true,
                pattern: /^-?\d*\.?\d*$/,
                validate: {
                  lessThanDeposit: val => {
                    return (
                      +val <= +getValues('formattedDeposits.proposalDeposit')
                    );
                  },
                },
              })}
            />{' '}
            {errors.formattedDeposits?.processingReward?.type ===
              'lessThanDeposit' && (
              <span className="required-field">
                processing reward must be less than that proposal deposit
              </span>
            )}
            {errors.formattedDeposits?.processingReward?.type ===
              'required' && <span className="required-field">required</span>}
            {errors.formattedDeposits?.processingReward?.type === 'pattern' && (
              <span className="required-field">not a number</span>
            )}{' '}
            {daoData.currency}
          </p>
        </div>
        <div className="StepControl">
          <button onClick={() => navigate(2)}>
            <ArrowLeftOutlined style={{ marginRight: '5px' }} />
            GO BACK
          </button>
          <button
            type="submit"
            disabled={isSubmitted || (!isDirty && !isValid)}
            className={
              isSubmitted || (!isDirty && !isValid)
                ? 'disabled Button'
                : 'Button'
            }
          >
            <FireOutlined /> Summon <FireOutlined />
          </button>
        </div>
      </form>
    </div>
  );
};

export default SummonStepThree;

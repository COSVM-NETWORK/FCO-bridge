import { useState, useEffect } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import _ from 'lodash'
import Switch from 'react-switch'
import { DebounceInput } from 'react-debounce-input'
import { Tooltip } from '@material-tailwind/react'
import { RiSettings3Line } from 'react-icons/ri'
import { BiInfoCircle } from 'react-icons/bi'

import Modal from '../../modals'
import { switchColor } from '../../../lib/utils'

const DEFAULT_BRIDGE_SLIPPAGE_PERCENTAGE =
  Number(
    process.env.NEXT_PUBLIC_DEFAULT_BRIDGE_SLIPPAGE_PERCENTAGE
  ) ||
  3

export default (
  {
    disabled = false,
    applied = false,
    initialData,
    onChange,
    showInfiniteApproval = true,
    hasNextAsset = false,
    chainData,
  },
) => {
  const {
    preferences,
  } = useSelector(state =>
    (
      {
        preferences: state.preferences,
      }
    ),
    shallowEqual,
  )
  const {
    theme,
  } = { ...preferences }

  const [data, setData] = useState(initialData)

  useEffect(
    () => {
      setData(initialData)
    },
    [initialData],
  )

  const reset = () => setData(initialData)

  const receiveLocalTooltip =
    !hasNextAsset &&
    `Unavailable on ${
      chainData?.name ||
      'Ethereum'
    }`

  const fields =
    [
      {
        label: 'Recipient Address',
        tooltip: 'Allows you to transfer to a different address than your connected wallet address.',
        name: 'to',
        type: 'text',
        placeholder: 'target recipient address',
      },
      {
        label: 'Infinite Approval',
        tooltip:
          showInfiniteApproval ?
            'This allows you to only need to pay for approval on your first transfer.' :
            'Approval sufficient. If you need to, please revoke using other tools.',
        name: 'infiniteApprove',
        type: 'switch',
      },
      /*
      {
        label: 'Slippage Tolerance',
        tooltip: 'The maximum percentage you are willing to lose due to market changes.',
        name: 'slippage',
        type: 'number',
        placeholder: '0.00',
        presets:
          [
            3.0,
            1.0,
            0.5,
          ],
        postfix: '%',
      },
      */
      {
        label: 'Receive NextAsset',
        tooltip: receiveLocalTooltip,
        name: 'receiveLocal',
        type: 'switch',
      },
      {
        label: 'Show NextAsset',
        name: 'showNextAssets',
        type: 'switch',
      },
    ]
    .filter(f => f)

  const changed =
    !_.isEqual(
      data,
      initialData,
    )

  const {
    forceSlow,
  } = { ...data }

  return (
    <Modal
      disabled={disabled}
      buttonTitle={
        <div className={`bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded flex items-center ${applied ? 'text-blue-400 hover:text-blue-500 dark:text-blue-500 dark:hover:text-blue-400' : 'text-slate-600 hover:text-slate-700 dark:text-slate-300 dark:hover:text-slate-200'} space-x-1 py-2 px-2`}>
          <RiSettings3Line
            size={20}
          />
        </div>
      }
      buttonClassName={`min-w-max ${disabled ? 'cursor-not-allowed' : ''} ${applied ? 'border border-blue-400 dark:border-blue-500' : ''} rounded flex items-center justify-center`}
      title={
        <span className="normal-case">
          Advanced options
        </span>
      }
      body={
        <div className="form mt-2">
          {fields
            .map((f, i) => {
              const {
                label,
                tooltip,
                name,
                size,
                type,
                placeholder,
                options,
                presets,
                postfix,
              } = { ...f }

              return (
                <div
                  key={i}
                  className="form-element"
                >
                  {
                    label &&
                    (tooltip ?
                      <Tooltip
                        placement="right"
                        content={tooltip}
                        className="z-50 bg-dark text-white text-xs"
                      >
                        <div className="w-fit flex items-center">
                          <div className="max-w-fit text-slate-600 dark:text-slate-200 font-medium mb-1">
                            {label}
                          </div>
                          <BiInfoCircle
                            size={16}
                            className="block sm:hidden text-slate-400 dark:text-slate-500 mb-0.5 ml-1 sm:ml-0"
                          />
                        </div>
                      </Tooltip> :
                      <div className="form-label text-slate-600 dark:text-slate-200 font-medium">
                        {label}
                      </div>
                    )
                  }
                  {type === 'select' ?
                    <select
                      placeholder={placeholder}
                      value={data?.[name]}
                      onChange={e => {
                        const _data = {
                          ...data,
                          [`${name}`]: e.target.value,
                        }

                        setData(_data)
                      }}
                      className="form-select bg-slate-50 rounded border-0 focus:ring-0"
                    >
                      {(options || [])
                        .map((o, j) => {
                          const {
                            title,
                            value,
                            name,
                          } = { ...o }

                          return (
                            <option
                              key={j}
                              title={title}
                              value={value}
                            >
                              {name}
                            </option>
                          )
                        })
                      }
                    </select> :
                    type === 'switch' ?
                      name === 'forceSlow' ?
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={
                              !(
                                (
                                  typeof data?.[name] === 'boolean' ?
                                    data[name] :
                                    false
                                ) ||
                                false
                              )
                            }
                            onChange={e => {
                              const _data = {
                                ...data,
                                [`${name}`]: !data?.[name],
                              }

                              setData(_data)
                            }}
                            checkedIcon={false}
                            uncheckedIcon={false}
                            onColor={switchColor(theme).on}
                            onHandleColor="#f8fafc"
                            offColor={switchColor(theme).off}
                            offHandleColor="#f8fafc"
                          />
                          {forceSlow ?
                            <div>
                              <span className="uppercase font-bold">
                                Slow
                              </span>
                            </div> :
                            <div>
                              <span className="uppercase font-bold">
                                Fast
                              </span>
                            </div>
                          }
                        </div> :
                        name === 'infiniteApprove' ?
                          <Tooltip
                            placement="right"
                            content={tooltip}
                            className="z-50 bg-dark text-white text-xs"
                          >
                            <div className="w-fit flex items-center">
                              <Switch
                                disabled={!showInfiniteApproval}
                                checked={
                                  (
                                    typeof data?.[name] === 'boolean' ?
                                      data[name] :
                                      false
                                  ) ||
                                  false
                                }
                                onChange={e => {
                                  const _data = {
                                    ...data,
                                    [`${name}`]: !data?.[name],
                                  }

                                  setData(_data)
                                }}
                                checkedIcon={false}
                                uncheckedIcon={false}
                                onColor={switchColor(theme).on}
                                onHandleColor="#f8fafc"
                                offColor={switchColor(theme).off}
                                offHandleColor="#f8fafc"
                              />
                            </div>
                          </Tooltip> :
                          name === 'receiveLocal' &&
                          receiveLocalTooltip ?
                            <Tooltip
                              placement="right"
                              content={receiveLocalTooltip}
                              className="z-50 bg-dark text-white text-xs"
                            >
                              <div className="w-fit flex items-center">
                                <Switch
                                  disabled={true}
                                  checked={
                                    (
                                      typeof data?.[name] === 'boolean' ?
                                        data[name] :
                                        false
                                    ) ||
                                    false
                                  }
                                  onChange={e => {
                                    const _data = {
                                      ...data,
                                      [`${name}`]: !data?.[name],
                                    }

                                    setData(_data)
                                  }}
                                  checkedIcon={false}
                                  uncheckedIcon={false}
                                  onColor={switchColor(theme).on}
                                  onHandleColor="#f8fafc"
                                  offColor={switchColor(theme).off}
                                  offHandleColor="#f8fafc"
                                />
                              </div>
                            </Tooltip> :
                            <Switch
                              checked={
                                (
                                  typeof data?.[name] === 'boolean' ?
                                    data[name] :
                                    false
                                ) ||
                                false
                              }
                              onChange={e => {
                                const _data = {
                                  ...data,
                                  [`${name}`]: !data?.[name],
                                }

                                setData(_data)
                              }}
                              checkedIcon={false}
                              uncheckedIcon={false}
                              onColor={switchColor(theme).on}
                              onHandleColor="#f8fafc"
                              offColor={switchColor(theme).off}
                              offHandleColor="#f8fafc"
                            /> :
                      type === 'textarea' ?
                        <textarea
                          type="text"
                          rows="5"
                          placeholder={placeholder}
                          value={data?.[name]}
                          onChange={e => {
                            const _data = {
                              ...data,
                              [`${name}`]: e.target.value,
                            }

                            setData(_data)
                          }}
                          className="form-textarea rounded border-0 focus:ring-0"
                        /> :
                        type === 'number' ?
                          <div className="flex items-center space-x-3">
                            <DebounceInput
                              debounceTimeout={750}
                              size={
                                size ||
                                'small'
                              }
                              type={type}
                              placeholder={placeholder}
                              value={
                                typeof data?.[name] === 'number' &&
                                data[name] >= 0 ?
                                  data[name] :
                                  ''
                              }
                              onChange={e => {
                                const regex = /^[0-9.\b]+$/

                                let value

                                if (
                                  e.target.value === '' ||
                                  regex.test(e.target.value)
                                ) {
                                  value = e.target.value
                                }

                                if (typeof value === 'string') {
                                  if (value.startsWith('.')) {
                                    value = `0${value}`
                                  }

                                  if (!isNaN(value)) {
                                    value = Number(value)
                                  }
                                }

                                value =
                                  [
                                    'slippage',
                                  ].includes(name) &&
                                  (
                                    value <= 0 ||
                                    value > 100
                                  ) ?
                                    DEFAULT_BRIDGE_SLIPPAGE_PERCENTAGE :
                                    value

                                const _data = {
                                  ...data,
                                  [`${name}`]:
                                    value &&
                                    !isNaN(value) ?
                                      parseFloat(
                                        Number(value)
                                          .toFixed(6)
                                      ) :
                                      value,
                                }

                                setData(_data)
                              }}
                              onWheel={e => e.target.blur()}
                              onKeyDown={e =>
                                [
                                  'e',
                                  'E',
                                  '-',
                                ].includes(e.key) &&
                                e.preventDefault()
                              }
                              className={`w-20 bg-slate-100 dark:bg-slate-800 rounded border-0 focus:ring-0 font-semibold py-1.5 px-2.5`}
                            />
                            {
                              presets?.length > 0 &&
                              (
                                <div className="flex items-center space-x-2.5">
                                  {presets
                                    .map((p, j) => (
                                      <div
                                        key={j}
                                        onClick={() => {
                                          const _data = {
                                            ...data,
                                            [`${name}`]: p,
                                          }

                                          setData(_data)
                                        }}
                                        className={`${data?.[name] === p ? 'bg-slate-100 dark:bg-slate-800 font-bold' : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 font-medium hover:font-semibold'} rounded cursor-pointer py-1 px-2`}
                                      >
                                        {p} {postfix}
                                      </div>
                                    ))
                                  }
                                </div>
                              )
                            }
                          </div> :
                          <input
                            type={type}
                            placeholder={placeholder}
                            value={data?.[name]}
                            onChange={e => {
                              const _data = {
                                ...data,
                                [`${name}`]: e.target.value,
                              }

                              setData(_data)
                            }}
                            className="form-input rounded border-0 focus:ring-0"
                          />
                  }
                </div>
              )
            })
          }
        </div>
      }
      onCancel={() => reset()}
      confirmDisabled={!changed}
      onConfirm={() => {
        if (onChange) {
          onChange(data)
        }
      }}
      confirmButtonTitle="Apply"
      onClose={() => reset()}
    />
  )
}
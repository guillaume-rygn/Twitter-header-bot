#!/usr/bin/env bash
set -Eeuo pipefail

#
# Expected to be called by the Makefile located
# in the root project directory
#
# ```
# API_KEY=''
# API_SECRET=''
# ACCESS_TOKEN=''
# ACCESS_SECRET=''
# SCREEN_NAME=''
# write_configuration_to_disk [ --help ]
# ```
#
function write_configuration_to_disk() {
    local show_help
    show_help=''

    {
        printf "%s\0" "${@}" | grep --line-regexp --quiet --null-data '\-\-help'

        if [ $? -eq 0 ]; then

            show_help='--help'

        fi

        {
            printf "%s\0" "${@}" | grep --line-regexp --quiet --null-data '\-h'

            if [ $? -eq 0 ] && [ -z "${show_help}" ]; then

                show_help='--help'

            fi

            if [ "${show_help}" = '--help' ]; then

                echo ''                                                                                               1>&2
                echo '# Configure Twitter account header bot'                                                         1>&2
                echo ''                                                                                               1>&2
                echo '```'                                                                                            1>&2
                echo "$ API_KEY='_' API_SECRET='_' ACCESS_TOKEN='_' ACCESS_SECRET='_' SCREEN_NAME='_' make configure" 1>&2
                echo '```'                                                                                            1>&2
                echo ''                                                                                               1>&2
                printf '%s'$'\n' '# Show this help menu by assigning a non-empty value to DEBUG environment variable' 1>&2

                return 0

            fi
        }
    }

    local _api_key
    _api_key="${API_KEY}"

    if [ -z "${_api_key}" ] || [ "${_api_key}" = '_' ];
    then

        printf 'A %s is expected to be declared as %s (%s).%s' 'non-empty string' 'an environment variable' 'API_KEY' $'\n' 1>&2

        return 1

    fi

    local _api_secret
    _api_secret="${API_SECRET}"

    if [ -z "${_api_secret}" ] || [ "${_api_secret}" = '_' ];
    then

        printf 'A %s is expected as a %s (%s).%s' 'non-empty string' 'an environment variable' 'API_SECRET' $'\n' 1>&2

        return 1

    fi

    local _access_token
    _access_token="${ACCESS_TOKEN}"

    if [ -z "${_access_token}" ] || [ "${_access_token}" = '_' ];
    then

        printf 'A %s is expected as a %s (%s).%s' 'non-empty string' 'an environment variable' 'API_TOKEN' $'\n' 1>&2

        return 1

    fi

    local _access_secret
    _access_secret="${ACCESS_SECRET}"

    if [ -z "${_access_secret}" ] || [ "${_access_secret}" = '_' ];
    then

        printf 'A %s is expected as a %s (%s).%s' 'non-empty string' 'an environment variable' 'ACCESS_SECRET' $'\n' 1>&2

        return 1

    fi

    local _screen_name
    _screen_name="${SCREEN_NAME}"

    if [ -z "${_screen_name}" ] || [ "${_screen_name}" = '_' ];
    then

        printf 'A %s is expected as a %s (%s).%s' 'non-empty string' 'an environment variable' 'SCREEN_NAME (without "@" prefix)' $'\n' 1>&2

        return 1

    fi

    if [ -e ./.env ];
    then

        printf '%s.%s' 'Skipping configuration, .env file already exists.' $'\n' 1>&2

        return 1

    fi

    printf \
        '%s'$'\n''%s'$'\n''%s'$'\n''%s'$'\n''%s'$'\n' \
        "API_KEY=${_api_key}" \
        "API_SECRET=${_api_secret}" \
        "ACCESS_TOKEN=${_access_token}" \
        "ACCESS_SECRET=${_access_secret}" \
        "SCREEN_NAME=${_screen_name}" \
        > ./.env
}

function configure() {
    DEBUG="${DEBUG:-}"

    if [ -z "${DEBUG}" ];
    then

        write_configuration_to_disk

    else

        write_configuration_to_disk --help

    fi
}

set +Eeuo pipefail

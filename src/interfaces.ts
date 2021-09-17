interface Repository {
    url: string
    html_url: string
    name: string
    full_name: string
    open_issues_count: number
    description: string
    language: string
    id: number
    archived: boolean
    pulls_url: string
    title: string
    private: boolean
    updated_at: Date
}

interface PullRequest {
    url: string
    html_url: string
    title: string
    id: number
    user: User
    repository: string
    base: {ref: string}
    head: {ref: string}
    updated_at: string
    draft: boolean

}

interface User {
    avatar_url: string
    login: string
}

export type {Repository, PullRequest}
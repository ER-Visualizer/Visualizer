import numpy as np

# Distributions
BETA = "beta"
BINOMIAL = "binomial"
CHISQUARE = "chisquare"
DIRICHLET = "dirichlet"
EXPONENTIAL = "exponential"
F = "f"
GAMMA = "gamma"
GEOMETRIC = "geometric"
GUMBEL = "gumbel"
HYPERGEOMETRIC = "hypergeometric"
LAPLACE = "laplace"
LOGISTIC = "logistic"
LOGNORMAL = "lognormal"
LOGSERIES = "logseries"
MULTINOMIAL = "multinomial"
MULTIVARIATE_NORMAL = "multivariate_normal"
NEGATIVE_BINOMIAL = "negative_binomial"
NONCENTRAL_CHISQUARE = "noncentral_chisquare"
NONCENTRAL_F = "noncentral_f"
NORMAL = "normal"
PARETO = "pareto"
POISSON = "poisson"
POWER = "power"
RAYLEIGH = "rayleigh"
STANDARD_CAUCHY = "standard_cauchy"
STANDARD_EXPONENTIAL = "standard_exponential"
STANDARD_GAMMA = "standard_gamma"
STANDARD_NORMAL = "standard_normal"
STANDARD_T = "standard_t"
TRIANGULAR = "triangular"
UNIFORM = "uniform"
VONMISSES = "vonmises"
WALD = "wald"
WEIBULL = "weibull"
ZIPF = "zipf"
FIXED = "fixed"

def fixed_number(number):
    return number


class_distributions = {
    BETA: np.random.beta,
    BINOMIAL: np.random.binomial,
    CHISQUARE: np.random.chisquare,
    DIRICHLET: np.random.dirichlet,
    EXPONENTIAL: np.random.exponential,
    F: np.random.f,
    GAMMA: np.random.gamma,
    GEOMETRIC: np.random.geometric,
    GUMBEL: np.random.gumbel,
    HYPERGEOMETRIC: np.random.hypergeometric,
    LAPLACE: np.random.laplace,
    LOGISTIC: np.random.logistic,
    LOGNORMAL: np.random.lognormal,
    LOGSERIES: np.random.logseries,
    MULTINOMIAL: np.random.multinomial,
    MULTIVARIATE_NORMAL: np.random.multivariate_normal,
    NEGATIVE_BINOMIAL: np.random.negative_binomial,
    NONCENTRAL_CHISQUARE: np.random.noncentral_chisquare,
    NONCENTRAL_F: np.random.noncentral_f,
    NORMAL: np.random.normal,
    PARETO: np.random.pareto,
    POISSON: np.random.poisson,
    POWER: np.random.power,
    RAYLEIGH: np.random.rayleigh,
    STANDARD_CAUCHY: np.random.standard_cauchy,
    STANDARD_EXPONENTIAL: np.random.standard_exponential,
    STANDARD_GAMMA: np.random.standard_gamma,
    STANDARD_NORMAL: np.random.standard_normal,
    STANDARD_T: np.random.standard_t,
    TRIANGULAR: np.random.triangular,
    UNIFORM: np.random.uniform,
    VONMISSES: np.random.vonmises,
    WALD: np.random.wald,
    WEIBULL: np.random.weibull,
    ZIPF: np.random.zipf,
    FIXED: fixed_number
}


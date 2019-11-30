from abc import ABC, abstractmethod
class Rule(ABC):
            
    @abstractmethod
    def check(self, patient):
        pass

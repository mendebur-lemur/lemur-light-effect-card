import pytest
pytest_plugins = "pytest_homeassistant_custom_component"

@pytest.fixture(autouse=True)
def auto_enable_custom_integrations(enable_custom_integrations):
    yield


@pytest.fixture(autouse=True)
def www(tmp_path):
    """The www folder the integration copies its loader into: a fresh one per test, not there yet."""
    from unittest.mock import patch
    folder = tmp_path / "www"
    with patch("custom_components.lemur_light_effects.resources._www", return_value=str(folder)):
        yield folder
